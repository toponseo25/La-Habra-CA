/**
 * RAS Heating & Air — analytics event taxonomy.
 *
 * Single source of truth for every event this landing page can fire. Defines:
 *   - Canonical event names (aligned to GA4 standard events + custom events
 *     for the RAS funnel so they map cleanly to GA4 / Google Ads / Meta Pixel)
 *   - Typed payload shapes for each event (discriminated union `AnalyticsEvent`)
 *
 * Why a typed taxonomy?
 *   - Every CTA, the form, scroll tracking, etc. all reference these constants
 *     so event names can never drift between the code and the analytics tools.
 *   - The discriminated union means the high-level `track()` functions can
 *     enforce the correct payload shape per event at compile time.
 *   - When the marketing team adds a new conversion in GA4/Ads/Meta, they grep
 *     this file for the event name and wire it up — no guessing.
 */

export const EventName = {
  // --- Standard GA4 events (recognized automatically by GA4 + Google Ads) ---
  page_view: "page_view",
  landing_page_view: "landing_page_view",
  scroll: "scroll",
  click: "click",
  form_start: "form_start",
  form_submit: "form_submit",
  generate_lead: "generate_lead",
  view_item: "view_item",
  user_engagement: "user_engagement",
  engagement_time: "engagement_time_msec",

  // --- RAS-specific custom events (forwarded to GA4 + Meta as custom events) ---
  cta_click: "cta_click",
  click_to_call: "click_to_call",
  form_field_focus: "form_field_focus",
  form_abandonment: "form_abandonment",
  external_link_click: "external_link_click",
  service_card_view: "service_card_view",
  faq_expand: "faq_expand",

  // --- Meta Pixel standard event names (sent in addition to GA4 events) ---
  meta_lead: "Lead",
  meta_contact: "Contact",
  meta_schedule: "Schedule",

  // --- Consent Mode v2 events (infrastructure — not mirrored to server) ---
  consent_default: "consent_default",
  consent_update: "consent_update",
} as const;

export type EventName = (typeof EventName)[keyof typeof EventName];

/* ------------------------- Typed payload definitions ------------------------ */

interface BasePayload {
  // Where on the page the event happened — included on every event so the
  // marketing team can build per-section funnels (e.g. hero CTR vs footer CTR).
  page_section?: string;
  // Echo attribution on every event so each event is independently attributable
  // even if the data layer is processed out of order.
  [key: string]: unknown;
}

export interface PageViewPayload extends BasePayload {
  page_title: string;
  page_location: string;
  page_path: string;
}

export interface ScrollPayload extends BasePayload {
  // Percent scrolled: 25 | 50 | 75 | 90 | 100
  percent_scrolled: number;
  // Pixels scrolled at the moment the threshold was crossed
  pixels_scrolled: number;
}

export interface ClickPayload extends BasePayload {
  // The text/id of the element clicked
  link_text: string;
  link_url: string;
  // outbound = true when the link leaves the site
  outbound: boolean;
}

export interface CtaClickPayload extends BasePayload {
  cta_label: string;
  cta_location: string;
  cta_target: "lead_form" | "phone" | "external" | "scroll";
}

export interface ClickToCallPayload extends BasePayload {
  cta_location: string;
  phone: string;
}

export interface FormStartPayload extends BasePayload {
  form_id: string;
  form_name: string;
}

export interface FormFieldFocusPayload extends BasePayload {
  form_id: string;
  field_name: string;
  // How many fields have been focused so far in this form session
  fields_focused_count: number;
}

export interface FormAbandonmentPayload extends BasePayload {
  form_id: string;
  fields_filled_count: number;
  // Which fields the user had filled before leaving
  fields_filled: string[];
  // Seconds of engagement before abandonment
  time_engaged_sec: number;
}

export interface FormSubmitPayload extends BasePayload {
  form_id: string;
  service_needed: string;
  // True if validation passed on the client; false if blocked by validation
  valid: boolean;
}

export interface GenerateLeadPayload extends BasePayload {
  service_needed: string;
  entry_point: "form" | "call";
  // Optional lead value for ROAS / revenue modeling (set when RAS defines LTV)
  value?: number;
  currency?: string;
  // Server-returned lead id (for joining server-side CRM events to GA4 events)
  lead_id?: string;
}

export interface EngagementTimePayload extends BasePayload {
  engagement_time_msec: number;
}

export interface ServiceCardViewPayload extends BasePayload {
  service_slug: string;
  service_title: string;
  card_index: number;
}

export interface FaqExpandPayload extends BasePayload {
  faq_index: number;
  faq_question: string;
}

export interface ExternalLinkClickPayload extends BasePayload {
  link_text: string;
  link_url: string;
  link_domain: string;
}

export interface ConsentUpdatePayload extends BasePayload {
  consent_choice: "granted" | "denied";
  source: "banner" | "stored" | "manual";
}

/* ----------------------- Discriminated union of events ----------------------- */

export type AnalyticsEvent =
  | { event: typeof EventName.page_view; payload: PageViewPayload }
  | { event: typeof EventName.landing_page_view; payload: PageViewPayload }
  | { event: typeof EventName.scroll; payload: ScrollPayload }
  | { event: typeof EventName.click; payload: ClickPayload }
  | { event: typeof EventName.cta_click; payload: CtaClickPayload }
  | { event: typeof EventName.click_to_call; payload: ClickToCallPayload }
  | { event: typeof EventName.form_start; payload: FormStartPayload }
  | {
      event: typeof EventName.form_field_focus;
      payload: FormFieldFocusPayload;
    }
  | {
      event: typeof EventName.form_abandonment;
      payload: FormAbandonmentPayload;
    }
  | { event: typeof EventName.form_submit; payload: FormSubmitPayload }
  | { event: typeof EventName.generate_lead; payload: GenerateLeadPayload }
  | { event: typeof EventName.engagement_time; payload: EngagementTimePayload }
  | { event: typeof EventName.user_engagement; payload: EngagementTimePayload }
  | {
      event: typeof EventName.service_card_view;
      payload: ServiceCardViewPayload;
    }
  | { event: typeof EventName.faq_expand; payload: FaqExpandPayload }
  | {
      event: typeof EventName.external_link_click;
      payload: ExternalLinkClickPayload;
    }
  | { event: typeof EventName.meta_lead; payload: GenerateLeadPayload }
  | { event: typeof EventName.meta_contact; payload: GenerateLeadPayload }
  | { event: typeof EventName.meta_schedule; payload: GenerateLeadPayload }
  | {
      event: typeof EventName.consent_default;
      payload: ConsentUpdatePayload;
    }
  | { event: typeof EventName.consent_update; payload: ConsentUpdatePayload };

/** Scroll depth thresholds we report (GA4 standard + 90% for near-complete). */
export const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100] as const;

/** How often (ms) we ping `engagement_time_msec` while the page is active. */
export const ENGAGEMENT_TIME_PING_MS = 10_000;
