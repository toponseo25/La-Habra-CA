/**
 * Analytics + tracking data layer for the RAS Heating & Air landing page.
 *
 * Import from `@/lib/analytics` — never from the individual submodules.
 *
 * Usage:
 *   import { trackCtaClick, trackLead, setupAutoTracking } from "@/lib/analytics";
 *
 * Architecture (data flow):
 *
 *   Application code
 *     -> track*() high-level API (tracker.ts)
 *        -> pushEvent() (dataLayer.ts)
 *           -> window.dataLayer (GTM picks it up)
 *           -> gtag() direct GA4 fallback (only when GTM is a placeholder)
 *           -> fbq() direct Meta Pixel fallback (with event-name mapping)
 *           -> POST /api/track server-side mirror (ad-blocker-proof)
 *           -> console.debug in dev
 *
 * Clarity (clarity.ts — uses the official @microsoft/clarity package):
 *   - Tag loads early via inline snippet in layout.tsx (advanced consent mode)
 *   - setClarityConsent() toggles recording in lockstep with Consent Mode v2
 *   - trackClarityEvent() fires custom events for high-signal moments
 *   - setClarityTag() / tagClaritySessionWithAttribution() tags sessions with
 *     attribution so you can filter recordings by source campaign
 *   - identifyClarityUser() stitches a session to a CRM lead id after submit
 *
 * Attribution (attribution.ts):
 *   - First-touch captured once, persisted to localStorage (2yr)
 *   - Last-touch captured per-session, persisted to sessionStorage (30min TTL)
 *   - gclid / fbclid / gbclid click identifiers preserved across form fills
 *
 * Consent (dataLayer.ts + clarity.ts):
 *   - Google Consent Mode v2 defaults pushed BEFORE any tag loads
 *   - consentGranted() uplifts on user accept (also resumes Clarity recording)
 *
 * Event taxonomy (events.ts):
 *   - Single source of truth for event names + payload shapes
 *   - Discriminated union AnalyticsEvent gives compile-time payload validation
 */

export * from "./events";
export * from "./dataLayer";
export * from "./attribution";
export * from "./tracker";
export * from "./clarity";
