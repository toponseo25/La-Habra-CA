import { NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";

/**
 * Server-side analytics event collector.
 *
 * The client `pushEvent()` mirrors every event here via navigator.sendBeacon
 * (survives page unload, ad-blocker-proof). This endpoint:
 *
 *   1. Validates the event shape minimally (event name + client_id required)
 *   2. Persists it to the TrackingEvent table with full attribution context
 *      (first/last touch + IP + UA + session id) — this is the source of truth
 *      for funnel analysis + CRM enrichment.
 *   3. Returns 204 No Content (sendBeacon doesn't read responses, so keep it tiny).
 *
 * This is the foundation for server-side conversion forwarding (Meta
 * Conversions API / CAPI, Google Ads Enhanced Conversions). Wire a worker
 * to this table to forward `generate_lead` rows to those APIs — that path
 * survives ad blockers and iOS privacy restrictions, which the client-side
 * pixels do not.
 *
 * Endpoint is intentionally permissive about payload shape (the typed
 * contract lives client-side in events.ts) so new events can be added
 * without a server redeploy.
 */

const ALLOWED_EVENTS = new Set([
  "page_view",
  "landing_page_view",
  "scroll",
  "click",
  "cta_click",
  "click_to_call",
  "form_start",
  "form_field_focus",
  "form_abandonment",
  "form_submit",
  "generate_lead",
  "Lead",
  "Contact",
  "Schedule",
  "engagement_time_msec",
  "user_engagement",
  "service_card_view",
  "faq_expand",
  "external_link_click",
]);

const MAX_PAYLOAD_BYTES = 16 * 1024; // 16KB per event is plenty

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  // Validate minimal shape. If it's not a valid event, still return 204 so
  // sendBeacon doesn't retry — bad events are logged but don't block the wire.
  const evt = body as {
    event?: string;
    payload?: Record<string, unknown>;
    client_id?: string;
    session_id?: string;
    attribution?: {
      first_touch?: Record<string, unknown>;
      last_touch?: Record<string, unknown>;
      source?: string;
    };
    sent_at?: string;
  };

  if (
    !evt ||
    typeof evt.event !== "string" ||
    typeof evt.client_id !== "string" ||
    !evt.client_id
  ) {
    return new NextResponse(null, { status: 204 });
  }

  // Unknown event names: still persist (the typed contract is client-side;
  // the server should never reject a new event added on the client). We keep
  // the ALLOWED_EVENTS set around for future server-side validation / abuse
  // filtering if a bad actor discovers the endpoint.
  const event = evt.event;
  void ALLOWED_EVENTS;

  // Cap payload size to prevent abuse
  const payloadStr = JSON.stringify(evt.payload ?? {});
  if (payloadStr.length > MAX_PAYLOAD_BYTES) {
    return new NextResponse(null, { status: 204 });
  }

  // Extract attribution — prefer the payload's top-level attribution (if the
  // client sent one), otherwise read from the payload itself (the first/last
  // touch is echoed on every event).
  const attribution = evt.attribution ?? {};
  const lastTouch = (attribution.last_touch ?? {}) as Record<string, string>;
  const firstTouch = (attribution.first_touch ?? {}) as Record<string, string>;
  const payload = (evt.payload ?? {}) as Record<string, string>;

  // Prefer explicit attribution; fall back to the payload's embedded fields.
  const utmSource =
    lastTouch.utm_source ?? payload.first_touch_utm_source ?? firstTouch.utm_source;
  const utmMedium = lastTouch.utm_medium ?? firstTouch.utm_medium;
  const utmCampaign = lastTouch.utm_campaign ?? firstTouch.utm_campaign;
  const utmTerm = lastTouch.utm_term ?? firstTouch.utm_term;
  const utmContent = lastTouch.utm_content ?? firstTouch.utm_content;
  const gclid = lastTouch.gclid ?? firstTouch.gclid;
  const fbclid = lastTouch.fbclid ?? firstTouch.fbclid;
  const gbpReferral = lastTouch.gbp ?? firstTouch.gbp;
  const referrer = lastTouch.referrer ?? firstTouch.referrer;
  const landingPage =
    lastTouch.landing_page ?? firstTouch.landing_page ?? payload.page_location;
  const source = attribution.source ?? "direct";

  try {
    if (!isDbAvailable || !db) {
      // No DB available (e.g. Vercel serverless without a hosted DB). The
      // event is still received + validated; we just don't persist it. Client-
      // side pixels (GA4 / Meta) still fired before this call, so tracking
      // works — only the server-side log is missing. Return 204 so sendBeacon
      // doesn't retry.
      return new NextResponse(null, { status: 204 });
    }
    await db.trackingEvent.create({
      data: {
        clientId: evt.client_id,
        name: event,
        payload: payloadStr,
        utmSource: utmSource ?? null,
        utmMedium: utmMedium ?? null,
        utmCampaign: utmCampaign ?? null,
        utmTerm: utmTerm ?? null,
        utmContent: utmContent ?? null,
        gclid: gclid ?? null,
        fbclid: fbclid ?? null,
        gbpReferral: gbpReferral ?? null,
        referrer: referrer ?? null,
        landingPage: landingPage ?? null,
        source,
        ipAddress: getClientIp(req),
        userAgent: req.headers.get("user-agent") ?? null,
        sessionId: evt.session_id ?? null,
      },
    });
  } catch (err) {
    // Never break the page on a tracking failure — just log it.
    console.error("[track] failed to persist event", event, err);
  }

  return new NextResponse(null, { status: 204 });
}

/** Respond to preflight / health checks so monitoring tools can probe. */
export async function GET() {
  return NextResponse.json({ ok: true, service: "ras-track" });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, GET, OPTIONS",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    },
  });
}

function getClientIp(req: Request): string | null {
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    null
  );
}
