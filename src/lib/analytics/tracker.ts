/**
 * High-level tracking API + automatic engagement tracking.
 *
 * This module is the ONLY thing application code should import. It exposes
 * semantic functions (`trackCtaClick`, `trackLead`, etc.) and a `setupAutoTracking`
 * helper that wires up the events a proper lead-gen landing page must track
 * automatically:
 *
 *   - Page view (with first/last-touch attribution context)
 *   - Scroll depth at 25/50/75/90/100% (GA4 standard `scroll` event)
 *   - Engagement time pings every 10s (GA4 `engagement_time_msec`)
 *   - External link clicks (so we can attribute outbound traffic)
 *   - Form engagement (form_start on first field focus, field_focus per field,
 *     form_abandonment on unload with fields filled but not submitted)
 *   - Visibility change (so we can subtract hidden time from engagement)
 *
 * Every event is:
 *   1. Pushed to the GTM dataLayer (canonical sink)
 *   2. Forwarded to gtag (direct GA4) + fbq (direct Meta Pixel) if present
 *   3. Mirrored to the server via POST /api/track (ad-blocker-proof server log)
 */

import {
  EventName,
  SCROLL_THRESHOLDS,
  ENGAGEMENT_TIME_PING_MS,
} from "./events";
import { pushEvent, setIdentity } from "./dataLayer";
import {
  captureAttribution,
  getAttribution,
  getOrCreateClientId,
  getOrCreateSessionId,
  deriveSource,
} from "./attribution";

/* --------------------------- Public tracking API --------------------------- */

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  const { firstTouch, lastTouch } = getAttribution();
  pushEvent({
    event: EventName.page_view,
    payload: {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_section: "header",
      first_touch_source: deriveSource(firstTouch),
      last_touch_source: deriveSource(lastTouch),
      first_touch: firstTouch,
      last_touch: lastTouch,
    },
  });
  // `landing_page_view` is a separate event so the marketing team can build
  // a "landed on La Habra page" audience without mixing in internal page_view
  // noise (this is a single-page landing, but the pattern scales).
  pushEvent({
    event: EventName.landing_page_view,
    payload: {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_section: "hero",
      first_touch_source: deriveSource(firstTouch),
      last_touch_source: deriveSource(lastTouch),
    },
  });
}

export function trackScroll(percent: number, pixels: number): void {
  pushEvent({
    event: EventName.scroll,
    payload: { percent_scrolled: percent, pixels_scrolled: pixels },
  });
}

export function trackCtaClick(
  ctaLabel: string,
  ctaLocation: string,
  ctaTarget: "lead_form" | "phone" | "external" | "scroll" = "scroll",
): void {
  pushEvent({
    event: EventName.cta_click,
    payload: {
      cta_label: ctaLabel,
      cta_location: ctaLocation,
      cta_target: ctaTarget,
      page_section: ctaLocation,
    },
  });
}

export function trackClickToCall(location: string, phone: string): void {
  pushEvent({
    event: EventName.click_to_call,
    payload: { cta_location: location, phone, page_section: location },
  });
}

export function trackFormStart(formId: string, formName: string): void {
  pushEvent({
    event: EventName.form_start,
    payload: { form_id: formId, form_name: formName, page_section: "lead_form" },
  });
}

export function trackFormFieldFocus(
  formId: string,
  fieldName: string,
  fieldsFocusedCount: number,
): void {
  pushEvent({
    event: EventName.form_field_focus,
    payload: {
      form_id: formId,
      field_name: fieldName,
      fields_focused_count: fieldsFocusedCount,
      page_section: "lead_form",
    },
  });
}

export function trackFormAbandonment(
  formId: string,
  fieldsFilled: string[],
  timeEngagedSec: number,
): void {
  pushEvent({
    event: EventName.form_abandonment,
    payload: {
      form_id: formId,
      fields_filled_count: fieldsFilled.length,
      fields_filled: fieldsFilled,
      time_engaged_sec: Math.round(timeEngagedSec),
      page_section: "lead_form",
    },
  });
}

export function trackFormSubmit(
  formId: string,
  serviceNeeded: string,
  valid: boolean,
): void {
  pushEvent({
    event: EventName.form_submit,
    payload: {
      form_id: formId,
      service_needed: serviceNeeded,
      valid,
      page_section: "lead_form",
    },
  });
}

export function trackLead(
  serviceNeeded: string,
  entryPoint: "form" | "call" = "form",
  opts: { leadId?: string; value?: number; currency?: string } = {},
): void {
  const { firstTouch, lastTouch } = getAttribution();
  const payload = {
    service_needed: serviceNeeded,
    entry_point: entryPoint,
    lead_id: opts.leadId,
    value: opts.value ?? 1,
    currency: opts.currency ?? "USD",
    page_section: "lead_form",
    first_touch_source: deriveSource(firstTouch),
    last_touch_source: deriveSource(lastTouch),
  };
  // GA4 standard conversion event
  pushEvent({
    event: EventName.generate_lead,
    payload,
  });
  // Meta standard conversion event (pushEvent maps generate_lead -> Meta Lead)
  pushEvent({
    event: EventName.meta_lead,
    payload,
  });
}

export function trackServiceCardView(
  slug: string,
  title: string,
  index: number,
): void {
  pushEvent({
    event: EventName.service_card_view,
    payload: {
      service_slug: slug,
      service_title: title,
      card_index: index,
      page_section: "services",
    },
  });
}

export function trackFaqExpand(index: number, question: string): void {
  pushEvent({
    event: EventName.faq_expand,
    payload: { faq_index: index, faq_question: question, page_section: "faq" },
  });
}

export function trackExternalLinkClick(
  text: string,
  url: string,
  domain: string,
): void {
  pushEvent({
    event: EventName.external_link_click,
    payload: { link_text: text, link_url: url, link_domain: domain },
  });
}

export function trackEngagementTime(msec: number): void {
  pushEvent({
    event: EventName.engagement_time,
    payload: { engagement_time_msec: msec },
  });
  // GA4 also wants a `user_engagement` event to keep the session alive; push
  // the same payload under that name so session duration is accurate.
  pushEvent({
    event: EventName.user_engagement,
    payload: { engagement_time_msec: msec },
  });
}

let autoTrackingSetup = false;

/**
 * Wire up all automatic event listeners. Safe to call multiple times — guards
 * against double-binding in React strict mode / HMR.
 *
 * Returns a cleanup function (useful for SPA navigation; on a single landing
 * page this lives for the lifetime of the tab).
 */
export function setupAutoTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  if (autoTrackingSetup) return () => {};
  autoTrackingSetup = true;

  // 1. Identity — set client + session ids into the data layer so every event
  //    pushed afterward is stamped with them.
  setIdentity(getOrCreateClientId(), getOrCreateSessionId());

  // 2. Capture attribution (first/last touch) on first load.
  captureAttribution();

  // 3. Fire the initial page view (after identity + attribution are ready).
  //    Use rAF so it fires after paint, not before.
  requestAnimationFrame(() => trackPageView());

  // 4. Scroll depth — fire each threshold exactly once.
  setupScrollDepth();

  // 5. Engagement time — ping every N seconds while the page is active.
  const stopEngagement = setupEngagementTime();

  // 6. External link clicks — capture any click that leaves the site.
  const stopExternal = setupExternalLinkTracking();

  return () => {
    stopEngagement();
    stopExternal();
    autoTrackingSetup = false;
  };
}

/* --------------------------- Internal: scroll depth -------------------------- */

function setupScrollDepth(): void {
  const fired = new Set<number>();
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackScroll(threshold, Math.round(scrollTop));
        }
      }
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  // Fire an immediate check in case the page loads already scrolled (refresh).
  onScroll();
}

/* ------------------------- Internal: engagement time ------------------------ */

function setupEngagementTime(): () => void {
  let total = 0;
  let lastStart = Date.now();
  let hidden = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  function reset() {
    lastStart = Date.now();
    hidden = false;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      if (!hidden) {
        total += Date.now() - lastStart;
        hidden = true;
      }
    } else if (hidden) {
      reset();
    }
  }

  function ping() {
    if (hidden) return;
    const now = Date.now();
    const delta = now - lastStart;
    total += delta;
    lastStart = now;
    if (total >= ENGAGEMENT_TIME_PING_MS) {
      // Send accumulated engagement in chunks so GA4's cumulative counter
      // matches what we report.
      trackEngagementTime(Math.round(total));
      total = 0;
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("focus", reset);
  window.addEventListener("blur", () => {
    if (!hidden) {
      total += Date.now() - lastStart;
      hidden = true;
    }
  });
  timer = setInterval(ping, ENGAGEMENT_TIME_PING_MS);

  return () => {
    if (timer) clearInterval(timer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("focus", reset);
  };
}

/* ----------------------- Internal: external link clicks ---------------------- */

function setupExternalLinkTracking(): () => void {
  function onClick(e: MouseEvent) {
    const target = (e.target as HTMLElement | null)?.closest?.("a");
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href) return;
    // tel: and mailto: are handled by their own click handlers; skip here.
    if (href.startsWith("tel:") || href.startsWith("mailto:")) return;
    // In-page anchors (#...) are not external
    if (href.startsWith("#")) return;
    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.hostname === window.location.hostname) return;
    trackExternalLinkClick(
      target.textContent?.trim() || href,
      href,
      url.hostname,
    );
  }
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

