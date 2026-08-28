/**
 * Microsoft Clarity integration — uses the official @microsoft/clarity package.
 *
 * Architecture:
 *   - The Clarity tag (clarity.js) loads early via the inline snippet in
 *     layout.tsx <head> so it can send consent-less pings before React
 *     hydrates (advanced consent mode requirement).
 *   - This module wraps the official `@microsoft/clarity` package for all
 *     subsequent interactions (consent, custom events, custom tags, identify).
 *     The package provides typed helpers that call `window.clarity(...)` under
 *     the hood.
 *
 * Why a dedicated module:
 *   - Single import surface for the rest of the codebase (analytics/index.ts)
 *   - Centralizes the "Clarity is configured?" guard so callers don't repeat
 *     the placeholder check
 *   - Makes it easy to fire RAS-specific custom events + tag sessions with
 *     attribution so you can filter recordings in the Clarity dashboard by
 *     "submitted a lead", "came from google-ads", "interested in AC Repair",
 *     etc.
 */

import Clarity from "@microsoft/clarity";
import { BUSINESS } from "@/lib/business";

const isPlaceholder = (id: string) => /X{4,}/.test(id) || !id;

/** True when a real Clarity project ID is configured in business.ts. */
export const isClarityEnabled = !isPlaceholder(BUSINESS.clarityProjectId);

/**
 * Initialize Clarity from the React layer. Safe to call multiple times — the
 * package's `injectScript` is idempotent (checks for an existing script tag
 * with the same id).
 *
 * NOTE: layout.tsx already injects the Clarity snippet inline in <head> so the
 * tag loads before React hydrates (for advanced consent mode). This React-side
 * init is a belt-and-suspenders call — if the inline snippet somehow didn't
 * fire (e.g. an ad blocker stripped it), this will load it. If the inline
 * snippet DID fire, this is a no-op.
 */
export function initClarity(): void {
  if (!isClarityEnabled) return;
  if (typeof window === "undefined") return;
  try {
    Clarity.init(BUSINESS.clarityProjectId);
  } catch (e) {
    console.error("[clarity] init failed", e);
  }
}

/* -------------------------------- Consent -------------------------------- */

/**
 * Set Clarity consent state. Call in lockstep with the Google Consent Mode v2
 * grant/deny flow so Clarity session recordings respect the user's cookie
 * choice.
 *
 * - granted = true  -> Clarity resumes session recording
 * - granted = false -> Clarity pauses recording (aggregate pings still fire)
 */
export function setClarityConsent(granted: boolean): void {
  if (!isClarityEnabled) return;
  if (typeof window === "undefined") return;
  try {
    Clarity.consent(granted);
  } catch {
    /* window.clarity may not be defined yet — the inline snippet queues
       the call so it's safe to ignore */
  }
}

/* ----------------------------- Custom events ----------------------------- */

/**
 * Fire a custom event into Clarity. Custom events appear in the Clarity
 * dashboard's Filters, Dashboard, Settings, and Recordings verticals — so you
 * can filter sessions by "users who clicked a CTA", "users who submitted a
 * lead", etc.
 *
 * Use this for high-signal conversion moments — NOT for every scroll/click
 * (that would clutter the Clarity dashboard). Recommended events:
 *   - "cta_click"          (with a tag for the CTA label)
 *   - "click_to_call"      (phone CTA)
 *   - "form_start"         (first field focus)
 *   - "form_submit"        (form submitted)
 *   - "generate_lead"      (lead successfully persisted)
 *   - "faq_expand"         (engagement signal)
 */
export function trackClarityEvent(eventName: string): void {
  if (!isClarityEnabled) return;
  if (typeof window === "undefined") return;
  try {
    Clarity.event(eventName);
  } catch {
    /* ignore — clarity not loaded yet */
  }
}

/* ------------------------------ Custom tags ------------------------------ */

/**
 * Tag the current Clarity session with a key/value. Tags show up as filters in
 * the Clarity dashboard so you can slice sessions by attribution, service
 * interest, etc.
 *
 * Examples:
 *   setClarityTag("source", "google-ads")
 *   setClarityTag("service", "AC Repair")
 *   setClarityTag("utm_campaign", "la-habra-hvac-spring")
 */
export function setClarityTag(key: string, value: string | string[]): void {
  if (!isClarityEnabled) return;
  if (typeof window === "undefined") return;
  try {
    Clarity.setTag(key, value);
  } catch {
    /* ignore */
  }
}

/**
 * Convenience: tag the session with attribution from the current visit. Call
 * once on page load (after attribution is captured) so every Clarity recording
 * for this session is filterable by its source campaign.
 */
export function tagClaritySessionWithAttribution(): void {
  if (!isClarityEnabled) return;
  if (typeof window === "undefined") return;
  try {
    const stored = window.__rasAttribution;
    if (!stored) return;
    const last = (stored as { lastTouch?: Record<string, string> }).lastTouch;
    const first = (stored as { firstTouch?: Record<string, string> }).firstTouch;
    const touch = last && Object.keys(last).length ? last : first;
    if (!touch) return;
    if (touch.utm_source) setClarityTag("utm_source", touch.utm_source);
    if (touch.utm_medium) setClarityTag("utm_medium", touch.utm_medium);
    if (touch.utm_campaign) setClarityTag("utm_campaign", touch.utm_campaign);
    if (touch.gclid) setClarityTag("source", "google-ads");
    else if (touch.fbclid) setClarityTag("source", "meta-ads");
    else if (touch.utm_source) setClarityTag("source", touch.utm_source);
    else setClarityTag("source", "direct");
  } catch {
    /* ignore */
  }
}

/* ------------------------------- Identify -------------------------------- */

/**
 * Identify a known user to Clarity. Call after a successful lead submission
 * using the server-returned lead id — lets you stitch a Clarity session to a
 * specific CRM record. Clarity hashes the customId on the client before
 * sending, so PII is not transmitted.
 */
export function identifyClarityUser(customId: string): void {
  if (!isClarityEnabled) return;
  if (typeof window === "undefined") return;
  try {
    Clarity.identify(customId);
  } catch {
    /* ignore */
  }
}
