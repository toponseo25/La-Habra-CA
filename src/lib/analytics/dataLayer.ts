/**
 * Data layer manager.
 *
 * Wraps `window.dataLayer` (the GTM data layer) with a typed push function and
 * a debug mode that logs every event to the console in development. Also
 * exposes helpers for Google Consent Mode v2 updates and user-scoping.
 *
 * The data layer is intentionally a plain Array pushed onto window — this is
 * exactly what GTM expects. Our typed `pushEvent` is a thin wrapper that:
 *   1. Validates the event shape at compile time via the AnalyticsEvent union
 *   2. Stamps the event with a `sent_at` timestamp for server-side dedup
 *   3. Stamps it with the current `client_id` and `session_id` so server-side
 *      forwarding (the /api/track endpoint) can stitch events to a visitor
 *   4. In dev mode, logs the event to the console with a colored prefix
 */

import { EventName, type AnalyticsEvent } from "./events";
import { setClarityConsent } from "./clarity";

/* --------------------------------- Types --------------------------------- */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    // Microsoft Clarity — queue function (same shape as gtag/fbq). The Clarity
    // bootstrap script (layout.tsx) sets `window.clarity` to a function that
    // pushes its arguments onto a queue until the real Clarity tag loads; once
    // loaded, queued calls are flushed. We call `clarity("consent", ...)` on it
    // for Consent Mode v2 parity with GA4.
    clarity?: (...args: unknown[]) => void;
    __rasAnalytics?: {
      clientId: string;
      sessionId: string;
      debug: boolean;
      initialized: boolean;
    };
    // Set by the inline bootstrap script in layout.tsx after first/last-touch
    // attribution is captured. Read by clarity.ts to tag Clarity sessions.
    __rasAttribution?: {
      firstTouch?: Record<string, string>;
      lastTouch?: Record<string, string>;
    };
  }
}

/* -------------------------------- Helpers -------------------------------- */

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function getMeta(): { clientId: string; sessionId: string; debug: boolean } {
  if (typeof window === "undefined") {
    return { clientId: "ssr", sessionId: "ssr", debug: false };
  }
  if (!window.__rasAnalytics) {
    window.__rasAnalytics = {
      clientId: "",
      sessionId: "",
      debug: isDev(),
      initialized: false,
    };
  }
  return window.__rasAnalytics;
}

/** Ensure window.dataLayer exists. Idempotent. */
export function initDataLayer(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
}

/* ------------------------------ Core push API ------------------------------ */

/**
 * Push a typed analytics event into the GTM data layer. Also forwards to gtag
 * (direct GA4) and fbq (direct Meta Pixel) when those are present, so events
 * land even if GTM is not configured.
 */
export function pushEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  initDataLayer();
  const meta = getMeta();

  // Stamp the event with identity + timestamp so server-side forwarding can
  // dedupe + stitch without re-reading the client.
  const enriched: Record<string, unknown> = {
    ...event.payload,
    event: event.event,
    sent_at: new Date().toISOString(),
    client_id: meta.clientId,
    session_id: meta.sessionId,
  };

  // 1. Push to GTM dataLayer (the canonical sink — GTM forwards to GA4, Google
  //    Ads, and Meta if those tags are configured in the container).
  window.dataLayer!.push(enriched);

  // 2. Direct gtag fallback (works without GTM, picks up GA4 if its ID is set).
  //    NOTE: the `gtag('config', ...)` call in layout.tsx already sends the
  //    initial `page_view` (send_page_view: true). We must NOT also send
  //    `page_view` via gtag('event', ...) here — that would double-count page
  //    views in GA4. We still push it to dataLayer above (for GTM / debug) but
  //    skip the gtag call for this one event. All other events go through gtag.
  if (
    typeof window.gtag === "function" &&
    event.event !== EventName.page_view
  ) {
    const { event: _evt, sent_at: _s, ...gtagParams } = enriched;
    window.gtag("event", event.event, gtagParams);
  }

  // 3. Direct Meta Pixel fallback for the lead-family events. Meta uses
  //    different event names than GA4, so we map the GA4-style events to
  //    Meta's standard events so conversion tracking works in both systems.
  if (typeof window.fbq === "function") {
    const metaEvent = mapToMetaEvent(event);
    if (metaEvent) {
      const safe = sanitizeForMeta(event.payload);
      if (metaEvent === "Lead") {
        // Meta Lead is a standard conversion event — must use track, not trackCustom
        window.fbq("track", "Lead", safe);
      } else {
        window.fbq("trackCustom", metaEvent, safe);
      }
    }
  }

  // 4. Mirror to the server-side tracking endpoint (ad-blocker-proof log).
  //    This is what powers server-side conversion forwarding (CAPI / Google
  //    Ads Enhanced Conversions) — client pixels get blocked; this doesn't.
  mirrorToServer(event, meta.clientId, meta.sessionId);

  // 5. Debug log in dev (or when debug flag is set on the console).
  if (meta.debug) {
    console.debug(
      `%c[analytics] ${event.event}`,
      "color:#ea580c;font-weight:bold",
      event.payload,
    );
  }
}

/* --------------------- Server-side mirror (fire-and-forget) -------------------- */

/**
 * Send the event to /api/track using sendBeacon (survives page unload, doesn't
 * block the UI). The server stores it in the TrackingEvent table — this is the
 * ad-blocker-proof source of truth for conversions.
 *
 * Defined here (not in tracker.ts) to avoid a circular import between
 * dataLayer.ts and tracker.ts.
 */
function mirrorToServer(
  event: AnalyticsEvent,
  clientId: string,
  sessionId: string,
): void {
  if (typeof window === "undefined") return;
  if (!clientId || clientId === "ssr") return;

  // Don't mirror infrastructure events (identity_set / consent_default /
  // consent_update) — they're not user behavior and would just bloat the
  // server log. Consent is enforced by the gtag.js + browser layer, not by us.
  if (
    event.event === ("identity_set" as string) ||
    event.event === EventName.consent_default ||
    event.event === EventName.consent_update
  ) {
    return;
  }

  const body = {
    event: event.event,
    payload: event.payload,
    client_id: clientId,
    session_id: sessionId,
    sent_at: new Date().toISOString(),
  };

  try {
    if ("sendBeacon" in navigator) {
      const blob = new Blob([JSON.stringify(body)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/track", blob);
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

function mapToMetaEvent(
  event: AnalyticsEvent,
): string | null {
  switch (event.event) {
    case "generate_lead":
    case "Lead":
      return "Lead";
    case "click_to_call":
      return "Contact";
    case "form_submit":
      return event.payload.valid ? "Schedule" : null;
    default:
      return null;
  }
}

/** Meta only accepts string/number/array values — coerce everything else. */
function sanitizeForMeta(payload: Record<string, unknown>): {
  [k: string]: string | number | string[];
} {
  const out: { [k: string]: string | number | string[] } = {};
  for (const [k, v] of Object.entries(payload)) {
    if (typeof v === "string" || typeof v === "number") out[k] = v;
    else if (Array.isArray(v)) out[k] = v.map(String);
    else if (typeof v === "boolean") out[k] = v ? "true" : "false";
    else if (v == null) continue;
    else out[k] = String(v);
  }
  return out;
}

/* ---------------------------- Identity + scoping ---------------------------- */

/** Set the anonymous client + session IDs used to stamp every event. */
export function setIdentity(clientId: string, sessionId: string): void {
  if (typeof window === "undefined") return;
  const meta = getMeta();
  meta.clientId = clientId;
  meta.sessionId = sessionId;
  // Mirror into the dataLayer so GTM's "Custom Variable: Constant" can pick
  // it up for Google Ads Enhanced Conversions user-id stitching.
  initDataLayer();
  window.dataLayer!.push({
    event: "identity_set",
    client_id: clientId,
    session_id: sessionId,
  });
}

/** Toggle debug logging at runtime (useful for QA). */
export function setDebug(on: boolean): void {
  if (typeof window === "undefined") return;
  getMeta().debug = on;
}

/* ----------------------------- Consent Mode v2 ----------------------------- */

export type ConsentGrant =
  | "granted"
  | "denied";

export interface ConsentState {
  ad_storage: ConsentGrant;
  ad_user_data: ConsentGrant;
  ad_personalization: ConsentGrant;
  analytics_storage: ConsentGrant;
  functionality_storage: ConsentGrant;
  security_storage: ConsentGrant;
}

const DEFAULT_CONSENT: ConsentState = {
  // Default-deny for ad-related storage (Google's recommended default for
  // Consent Mode v2). The page doesn't show a cookie banner, so for a US-only
  // HVAC campaign we immediately uplift to granted on load via `consentGranted()`
  // in the AnalyticsProvider — but we keep the deny defaults here so the
  // infrastructure is correct for any future region that requires consent.
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
};

/**
 * Push Google Consent Mode v2 defaults into the data layer. Must be called
 * BEFORE any tags load (GTM reads the first `consent` push as the default
 * state). Our layout.tsx calls this inline in <head> before GTM.
 */
export function pushConsentDefaults(state: ConsentState = DEFAULT_CONSENT): void {
  if (typeof window === "undefined") return;
  initDataLayer();
  window.dataLayer!.push({
    event: "consent_default",
    consent_state: state,
  });
  // Direct gtag path for when GTM isn't used
  if (typeof window.gtag === "function") {
    window.gtag("consent", "default", state);
  }
}

/** Uplift consent to granted (call when the user accepts cookies / for US). */
export function consentGranted(
  state: Partial<ConsentState> = {},
): void {
  if (typeof window === "undefined") return;
  const granted: ConsentState = {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
    functionality_storage: "granted",
    security_storage: "granted",
    ...state,
  };
  initDataLayer();
  window.dataLayer!.push({
    event: "consent_update",
    consent_state: granted,
  });
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", granted);
  }
  // Microsoft Clarity parity: grant consent so session recording resumes.
  // setClarityConsent is imported from ./clarity (uses the official
  // @microsoft/clarity package's typed Clarity.consent() helper).
  setClarityConsent(true);
}
