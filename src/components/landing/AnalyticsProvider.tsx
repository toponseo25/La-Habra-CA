"use client";

import { useEffect } from "react";
import {
  setupAutoTracking,
  trackFormAbandonment,
  trackFormFieldFocus,
  trackFormStart,
  trackFormSubmit,
  trackFaqExpand,
  consentGranted,
} from "@/lib/analytics";

/**
 * Client-side analytics orchestrator.
 *
 * Mounted once near the root of the page. Responsibilities:
 *
 *   1. Initialize the data layer + identity + attribution on mount.
 *   2. Wire up all automatic engagement tracking (scroll depth, engagement
 *      time, external link clicks) via setupAutoTracking().
 *   3. Fire the initial page_view + landing_page_view events.
 *   4. Uplift Google Consent Mode v2 to "granted" (US-only HVAC campaign — no
 *      cookie banner needed, but the consent-mode infrastructure is correct
 *      so the page is ready for any future region that requires it).
 *   5. Wire up FORM ENGAGEMENT tracking via event delegation on #lead-form:
 *        - form_start: fires once on first field focus
 *        - form_field_focus: fires on every field focus (with cumulative count)
 *        - form_abandonment: fires on page unload if form was started but not
 *          submitted (with which fields were filled + time engaged)
 *        - form_submit: fires on form submission (valid: true|false)
 *   6. Wire up FAQ expand tracking (single delegated listener on #faq).
 *
 * All listeners are cleaned up on unmount so the component is safe under HMR
 * and React strict mode.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    // 1-3. Initialize data layer, identity, attribution, page view, + auto tracking.
    const cleanup = setupAutoTracking();

    // 4. Uplift consent to granted for the US-only HVAC campaign. (Swap this
    //    for a banner-driven uplift if the campaign expands to the EU/CA.)
    consentGranted();

    // 5. Form engagement tracking via delegation (no per-field listeners).
    const formCleanup = setupFormEngagementTracking();

    // 6. FAQ expand tracking.
    const faqCleanup = setupFaqTracking();

    return () => {
      cleanup();
      formCleanup();
      faqCleanup();
    };
  }, []);

  return null;
}

/* ------------------------- Form engagement tracking ------------------------- */

function setupFormEngagementTracking(): () => void {
  if (typeof window === "undefined") return () => {};
  const FORM_ID = "lead-form";
  const FORM_NAME = "ras_la_habra_lead_form";

  let started = false;
  let firstFocusAt: number | null = null;
  let lastFocusAt: number | null = null;
  const focusedFields = new Set<string>();
  const filledFields = new Set<string>();
  let submitted = false;

  function getForm(): HTMLFormElement | null {
    return document.querySelector(`#${FORM_ID} form`);
  }

  function onFocusIn(e: FocusEvent) {
    const form = getForm();
    if (!form) return;
    const target = e.target as HTMLElement | null;
    if (!target || !form.contains(target)) return;

    // Only track real input-like elements
    const tag = target.tagName.toLowerCase();
    const isField =
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      target.getAttribute("role") === "combobox" ||
      target.getAttribute("role") === "checkbox" ||
      target.getAttribute("role") === "option";
    if (!isField) return;

    // Derive a stable field name from name / id / aria-label / placeholder
    const name =
      (target as HTMLInputElement).name ||
      target.id ||
      target.getAttribute("aria-label") ||
      (target as HTMLInputElement).placeholder ||
      tag;

    // form_start: fire once on the very first field focus
    if (!started) {
      started = true;
      firstFocusAt = Date.now();
      lastFocusAt = Date.now();
      trackFormStart(FORM_ID, FORM_NAME);
    }

    // form_field_focus: every focus (cumulative count)
    focusedFields.add(name);
    trackFormFieldFocus(FORM_ID, name, focusedFields.size);
    lastFocusAt = Date.now();
  }

  function onChange(e: Event) {
    const form = getForm();
    if (!form) return;
    const target = e.target as HTMLElement | null;
    if (!target || !form.contains(target)) return;
    const name =
      (target as HTMLInputElement).name ||
      target.id ||
      target.getAttribute("aria-label") ||
      (target as HTMLInputElement).tagName.toLowerCase();

    // Track "filled" as: the field has a non-empty value OR a checkbox is checked
    const input = target as HTMLInputElement;
    const isCheckbox = input.type === "checkbox" || input.type === "radio";
    const hasValue = isCheckbox ? input.checked : !!input.value?.trim();
    if (hasValue) filledFields.add(name);
    else filledFields.delete(name);
  }

  function onSubmit(e: Event) {
    const form = getForm();
    if (!form || e.target !== form) return;
    submitted = true;
    // The form's validation state is read from the form element's validity
    // (the LeadForm component also pushes a richer form_submit with the
    // service — this delegated one is the safety net in case the component
    // hook fails to fire, e.g. on a JS error).
    const valid = form.checkValidity();
    trackFormSubmit(FORM_ID, "unknown", valid);
  }

  function onBeforeUnload() {
    if (!started || submitted) return;
    // User started the form but left without submitting — fire abandonment
    // with the fields they had filled + total time engaged.
    const timeEngagedSec =
      firstFocusAt != null ? (Date.now() - firstFocusAt) / 1000 : 0;
    trackFormAbandonment(
      FORM_ID,
      Array.from(filledFields),
      timeEngagedSec,
    );
  }

  // Use capture-phase focusin/focusout (focus/blur don't bubble).
  document.addEventListener("focusin", onFocusIn, true);
  document.addEventListener("change", onChange, true);
  // Attach submit to the form once it exists (the form is rendered immediately
  // so this should resolve synchronously; if not, the listener just no-ops).
  const form = getForm();
  form?.addEventListener("submit", onSubmit);
  window.addEventListener("pagehide", onBeforeUnload);
  window.addEventListener("beforeunload", onBeforeUnload);

  return () => {
    document.removeEventListener("focusin", onFocusIn, true);
    document.removeEventListener("change", onChange, true);
    form?.removeEventListener("submit", onSubmit);
    window.removeEventListener("pagehide", onBeforeUnload);
    window.removeEventListener("beforeunload", onBeforeUnload);
  };
}

/* ----------------------------- FAQ tracking ----------------------------- */

function setupFaqTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  // Radix Accordion updates `aria-expanded` during the click's bubble phase.
  // A capture-phase click listener would read the pre-toggle state, so instead
  // we use a MutationObserver to fire when `aria-expanded` actually flips to
  // "true". This is robust to however Radix chooses to trigger (pointer,
  // keyboard, programmatic) and only fires once per expand.
  const faqRoot = document.querySelector("#faq");
  if (!faqRoot || typeof MutationObserver === "undefined") return () => {};

  const buttons = Array.from(
    faqRoot.querySelectorAll<HTMLElement>("button[aria-expanded]"),
  );

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type !== "attributes") continue;
      const btn = m.target as HTMLElement;
      if (btn.getAttribute("aria-expanded") !== "true") continue;
      const question = btn.textContent?.trim() || "(unknown question)";
      const index = buttons.indexOf(btn);
      trackFaqExpand(index < 0 ? -1 : index, question);
    }
  });

  for (const btn of buttons) {
    observer.observe(btn, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });
  }

  return () => observer.disconnect();
}
