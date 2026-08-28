import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BUSINESS } from "@/lib/business";
import { z } from "zod";

/**
 * RAS Heating & Air — Lead submission endpoint.
 *
 * This is the single funnel entry point for the La Habra landing page. Every
 * form submission lands here, gets validated, persisted to the `Lead` table
 * (which is the source of truth for the RAS CRM pipeline), and triggers the
 * downstream CRM workflow:
 *
 *   Landing Page Visitor
 *     -> Call / Form Submission  (this endpoint = Form Submission)
 *     -> Lead Created            (db.lead.create)
 *     -> Lead Source Tagged      (attribution captured from client)
 *     -> Instant SMS/Email Response  (stubbed — wire to provider)
 *     -> RAS Notification        (stubbed — wire to provider)
 *     -> Appointment -> Estimate -> Booked Job -> Review Request -> Follow-Up
 *
 * The persistence + source tagging steps are fully implemented here. The
 * SMS/email/notification steps are stubbed and clearly marked so the RAS team
 * can connect their provider (Twilio / SendGrid / Slack / CRM webhook) later.
 */

// Allowed service values — kept in sync with the SERVICES constant in business.ts
// so the dropdown on the form and the validation here can never drift apart.
const ALLOWED_SERVICES = [
  "AC Repair",
  "AC Installation & Replacement",
  "Heating & Furnace Repair",
  "HVAC Installation",
  "HVAC Maintenance",
  "Mini-Split Systems",
  "Indoor Air Quality",
  "Emergency HVAC Service",
  "Not Sure / General Inquiry",
] as const;

const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .regex(/^[0-9()+\-\s.]+$/, "Phone contains invalid characters"),
  email: z.string().email("A valid email is required").max(160),
  zipCode: z
    .string()
    .min(5, "ZIP code is required")
    .max(10)
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Enter a valid ZIP code"),
  serviceNeeded: z.enum(ALLOWED_SERVICES, {
    errorMap: () => ({ message: "Please choose a service" }),
  }),
  appointmentTime: z.string().max(80).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please consent to be contacted",
  }),

  // Attribution — all optional. Captured client-side from URL + sessionStorage.
  source: z.string().max(120).optional().nullable(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_medium: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  utm_term: z.string().max(200).optional().nullable(),
  utm_content: z.string().max(200).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  landingPage: z.string().max(500).optional().nullable(),
  gclid: z.string().max(200).optional().nullable(),
  fbclid: z.string().max(200).optional().nullable(),
  gbpReferral: z.string().max(200).optional().nullable(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }
  const d = parsed.data;

  // --- Service-area guard ---
  // The campaign is intentionally restricted to La Habra + ~2–5 mile radius.
  // We do NOT hard-reject leads (a homeowner just outside the radius may still
  // be serviceable), but we tag the lead so the RAS team can triage.
  const inServiceArea = isInServiceArea(d.zipCode);
  const inferredSource =
    d.source ||
    inferSource({
      utmSource: d.utm_source,
      gclid: d.gclid,
      fbclid: d.fbclid,
      gbp: d.gbpReferral,
      referrer: d.referrer,
    });

  // --- Persist lead ---
  let lead;
  try {
    lead = await db.lead.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        phone: d.phone,
        email: d.email,
        zipCode: d.zipCode,
        serviceNeeded: d.serviceNeeded,
        appointmentTime: d.appointmentTime ?? null,
        message: d.message ?? null,
        source: inferredSource,
        utmSource: d.utm_source ?? null,
        utmMedium: d.utm_medium ?? null,
        utmCampaign: d.utm_campaign ?? null,
        utmTerm: d.utm_term ?? null,
        utmContent: d.utm_content ?? null,
        referrer: d.referrer ?? null,
        landingPage: d.landingPage ?? null,
        gclid: d.gclid ?? null,
        fbclid: d.fbclid ?? null,
        gbpReferral: d.gbpReferral ?? null,
        stage: "new",
        entryPoint: "form",
        consent: true,
        ipAddress: getClientIp(req),
        userAgent: req.headers.get("user-agent") ?? null,
        notes: inServiceArea
          ? null
          : "Outside primary 2–5mi La Habra radius — confirm serviceability before booking.",
      },
    });
  } catch (err) {
    console.error("[leads] failed to persist lead", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your request. Please call us." },
      { status: 500 },
    );
  }

  // --- CRM workflow triggers (stubs — wire to providers) ---
  // Each of these is a no-op until the RAS team provides credentials, but they
  // are logged so the pipeline is observable during testing.
  await triggerCrmWorkflow(lead).catch((e) =>
    console.error("[leads] CRM workflow error", e),
  );

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    inServiceArea,
    message:
      "Thanks! Your request was received. A RAS Heating & Air specialist will reach out shortly.",
    // Surface the phone number back to the UI so we can show a "Need help now? Call" fallback.
    phone: BUSINESS.phoneDisplay,
  });
}

/* --------------------------------- Helpers -------------------------------- */

// ZIP prefixes for the La Habra, CA primary service radius. 90631 & 90632 are
// La Habra proper; 90633, 90634 (partial) and surrounding cities 92821/92822
// (Brea), 92835 (Fullerton foothills), 92823 (La Mirada) are included as the
// ~2–5 mile radius. This is intentionally permissive — real serviceability is
// confirmed by the RAS dispatcher.
const SERVICE_ZIP_PREFIXES = ["9063", "9062", "9282", "9283", "90620", "90621"];

function isInServiceArea(zip: string): boolean {
  const z = zip.replace(/[^0-9]/g, "").slice(0, 5);
  return SERVICE_ZIP_PREFIXES.some((p) => z.startsWith(p.slice(0, 3)));
}

function inferSource(input: {
  utmSource?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  gbp?: string | null;
  referrer?: string | null;
}): string {
  if (input.gclid) return "google-ads";
  if (input.fbclid) return "meta-ads";
  if (input.gbp) return "google-business-profile";
  if (input.utmSource) return input.utmSource;
  if (input.referrer) {
    try {
      const host = new URL(input.referrer).hostname;
      if (host.includes("google.")) return "google-organic";
      if (host.includes("facebook.") || host.includes("instagram."))
        return "social-organic";
      if (host.includes("bing.")) return "bing-organic";
      return `referral:${host}`;
    } catch {
      return "direct";
    }
  }
  return "direct";
}

function getClientIp(req: Request): string | null {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    null
  );
}

/**
 * Stub for the downstream CRM pipeline. Each step is logged so the funnel is
 * observable. Replace the console.log lines with real provider calls:
 *
 *  1. Instant SMS/email auto-response to the homeowner
 *     -> Twilio / SendGrid / Postmark
 *  2. Instant notification to the RAS team
 *     -> Slack webhook / CRM API / email-to-SMS gateway
 *  3. (Appointment booking, estimate, etc. happen in the CRM after this point)
 */
async function triggerCrmWorkflow(lead: {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  serviceNeeded: string;
  zipCode: string;
  source: string | null;
}) {
  // 1. Instant auto-response to the homeowner
  console.log(
    `[crm] AUTO-RESPONSE -> homeowner ${lead.email} / ${lead.phone}: ` +
      `"Hi ${lead.firstName}, thanks for contacting RAS Heating & Air! We received your ${lead.serviceNeeded} request and a specialist will reach out shortly."`,
  );

  // 2. Instant notification to the RAS team
  console.log(
    `[crm] NEW LEAD ALERT -> RAS team: ${lead.firstName} ${lead.lastName} ` +
      `| ${lead.serviceNeeded} | ZIP ${lead.zipCode} | source=${lead.source} ` +
      `| phone=${lead.phone} | email=${lead.email} | leadId=${lead.id}`,
  );

  // 3. Mark this lead as "contacted" stage would be set by the dispatcher
  //    after the first outreach attempt — handled in the CRM UI / next step.

  return true;
}

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "ras-leads", method: "POST" },
    { status: 200 },
  );
}
