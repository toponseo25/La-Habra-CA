/**
 * Analytics + lead attribution helpers for the RAS Heating & Air landing page.
 *
 * Design goals:
 *  - Make every lead attributable to its source whenever technically possible.
 *  - Push events into GTM's dataLayer (so GA4, Google Ads, and Meta Pixel can
 *    all listen through a single container) AND fire the Meta Pixel directly
 *    for redundancy.
 *  - Capture UTM + click identifiers (gclid/fbclid/gbp) from the landing URL so
 *    the lead record in the DB carries full attribution.
 *
 * All functions are no-ops when the relevant tracking IDs are not configured
 * (still the placeholder values), so the page works correctly out of the box
 * and lights up automatically once real IDs are dropped into BUSINESS.
 */

import { BUSINESS } from "./business";

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/* ----------------------------- UTM / attribution ---------------------------- */

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  gbp?: string;
  referrer?: string;
  landing_page?: string;
};

/**
 * Reads UTM + click-id parameters from the current URL and from sessionStorage
 * (so we preserve attribution across page navigation / a slow form fill).
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const stored = sessionStorage.getItem("ras_attribution");
  const storedAttrib: Attribution = stored ? safeParse(stored) : {};

  const attrib: Attribution = {
    utm_source: params.get("utm_source") ?? storedAttrib.utm_source ?? undefined,
    utm_medium: params.get("utm_medium") ?? storedAttrib.utm_medium ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? storedAttrib.utm_campaign ?? undefined,
    utm_term: params.get("utm_term") ?? storedAttrib.utm_term ?? undefined,
    utm_content: params.get("utm_content") ?? storedAttrib.utm_content ?? undefined,
    gclid: params.get("gclid") ?? storedAttrib.gclid ?? undefined,
    fbclid: params.get("fbclid") ?? storedAttrib.fbclid ?? undefined,
    gbp: params.get("gbp") ?? storedAttrib.gbp ?? undefined,
    referrer: document.referrer || storedAttrib.referrer || undefined,
    landing_page: window.location.href,
  };

  // Persist so a user who navigates around / takes time to fill the form
  // still attributes correctly at submission time.
  sessionStorage.setItem("ras_attribution", JSON.stringify(attrib));
  return attrib;
}

function safeParse(s: string): Attribution {
  try {
    return JSON.parse(s) as Attribution;
  } catch {
    return {};
  }
}

/* --------------------------------- Events --------------------------------- */

function pushDataLayer(event: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

function isPlaceholder(id: string) {
  return /X{4,}/.test(id);
}

/**
 * Fire a generic conversion-style event into GTM + GA4 + Meta Pixel.
 * Event names match the recommended GA4 / Meta conventions so the marketing
 * team can wire them up to their conversion goals without renaming.
 */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
) {
  // Always push to dataLayer — GTM handles GA4 + Google Ads forwarding.
  pushDataLayer({ event: name, ...params });

  // GA4 direct gtag fallback (works even without GTM).
  if (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    !isPlaceholder(BUSINESS.ga4MeasurementId)
  ) {
    window.gtag("event", name, params);
  }

  // Meta Pixel direct fallback.
  if (
    typeof window !== "undefined" &&
    typeof window.fbq === "function" &&
    !isPlaceholder(BUSINESS.metaPixelId)
  ) {
    // Meta only accepts string/number/array values, so coerce.
    const safe: Record<string, string | number | string[]> = {};
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === "string" || typeof v === "number") safe[k] = v;
      else if (Array.isArray(v)) safe[k] = v.map(String);
      else safe[k] = String(v);
    }
    window.fbq("trackCustom", name, safe);
  }
}

/* ------------------------------ Specific CTAs ------------------------------ */

/** Fired when a visitor clicks any click-to-call link or the sticky call button. */
export function trackClickToCall(location: string) {
  trackEvent("click_to_call", {
    cta_location: location,
    phone: BUSINESS.phoneDisplay,
  });
}

/** Fired when a visitor clicks a CTA that scrolls to / opens the lead form. */
export function trackCtaClick(label: string, location: string) {
  trackEvent("cta_click", {
    cta_label: label,
    cta_location: location,
  });
}

/** Fired when the lead form is submitted successfully. */
export function trackLead(serviceNeeded: string, entryPoint: "form" | "call" = "form") {
  // Standard GA4 "generate_lead" event — maps cleanly to GA4 + Google Ads conversion.
  trackEvent("generate_lead", {
    service_needed: serviceNeeded,
    entry_point: entryPoint,
    value: 1,
    currency: "USD",
  });
  // Meta's dedicated Lead custom event.
  trackEvent("Lead", { service_needed: serviceNeeded, entry_point: entryPoint });
}
