/**
 * First-touch + last-touch attribution.
 *
 * "Proper" attribution for a paid lead-gen landing page must distinguish:
 *
 *   - FIRST TOUCH: the campaign that originally brought the visitor to the
 *     site. Persisted permanently (localStorage, 2-year expiry) so we never
 *     overwrite it — a visitor who first arrived via Google Ads and later
 *     returns via organic search still credits Google Ads for the lead.
 *
 *   - LAST TOUCH (a.k.a. session): the most recent campaign. Reset on every
 *     new session (defined as a new referrer or >30min gap), so we can see
 *     the immediate touchpoint that drove the conversion.
 *
 * Both snapshots are sent to the server on every event so the CRM can model
 * multi-touch attribution (e.g. "first paid, last organic") without ever
 * losing the original ad click.
 *
 * We also persist gclid / fbclid / gbclid click identifiers, which are the
 * keys Google Ads, Meta, and Google Business Profile use to tie conversions
 * back to the specific ad click. These MUST survive across the time it
 * takes a homeowner to fill out a form (often minutes to hours).
 */

const FIRST_TOUCH_KEY = "ras_first_touch";
const LAST_TOUCH_KEY = "ras_last_touch";
const CLIENT_ID_KEY = "ras_client_id";
const SESSION_ID_KEY = "ras_session_id";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 min

export interface Attribution {
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
  captured_at?: string;
}

export interface FullAttribution {
  firstTouch: Attribution;
  lastTouch: Attribution;
}

/** Read-only safe storage helpers (fail gracefully if storage is blocked). */
function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeLS(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore (private mode / storage full) */
  }
}
function readSS(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeSS(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

/** Generate a stable anonymous client id (UUID-ish). Persists 2 years. */
export function getOrCreateClientId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = readLS(CLIENT_ID_KEY);
  if (!id) {
    id = generateId();
    writeLS(CLIENT_ID_KEY, id);
  }
  return id;
}

/** Per-tab session id (used for grouping events within one browsing session). */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = readSS(SESSION_ID_KEY);
  if (!id) {
    id = generateId();
    writeSS(SESSION_ID_KEY, id);
  }
  return id;
}

function generateId(): string {
  // Use crypto.randomUUID when available; fall back to a timestamp+random.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      /* fall through */
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Read UTM + click-id params from a URLSearchParams object. */
function paramsToAttribution(
  params: URLSearchParams,
  landingPage: string,
  referrer: string,
): Attribution {
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
    gclid: params.get("gclid") || undefined,
    fbclid: params.get("fbclid") || undefined,
    gbp: params.get("gbp") || undefined,
    referrer: referrer || undefined,
    landing_page: landingPage,
    captured_at: new Date().toISOString(),
  };
}

/** Remove keys with undefined values so the stored snapshot stays compact. */
function clean(a: Attribution): Attribution {
  const out: Attribution = {};
  for (const [k, v] of Object.entries(a)) {
    if (v !== undefined && v !== null && v !== "") {
      (out as Attribution)[k as keyof Attribution] = v as never;
    }
  }
  return out;
}

/** True if this URL+referrer counts as a "new session" (resets last touch). */
function isNewSession(a: Attribution): boolean {
  if (a.utm_source || a.gclid || a.fbclid || a.gbp) return true;
  if (a.referrer && !isInternalReferrer(a.referrer)) return true;
  return false;
}

function isInternalReferrer(referrer: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const host = new URL(referrer).hostname;
    const selfHost = window.location.hostname;
    return host === selfHost || host.endsWith("." + selfHost);
  } catch {
    return false;
  }
}

/**
 * Capture attribution from the current URL + referrer. Updates first-touch
 * (only if no first-touch exists) and last-touch (always, on new sessions).
 *
 * Call once on page load.
 */
export function captureAttribution(): FullAttribution {
  if (typeof window === "undefined") {
    return { firstTouch: {}, lastTouch: {} };
  }

  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  const landingPage = window.location.href;
  const fresh = clean(paramsToAttribution(params, landingPage, referrer));

  // --- First touch: only set once per visitor (2yr persistence) ---
  let firstTouch = safeParse<Attribution>(readLS(FIRST_TOUCH_KEY)) || {};
  // Enrich first touch with any missing fields the URL just provided (e.g.
  // the visitor had a stale firstTouch from before we added gclid tracking).
  if (Object.keys(firstTouch).length === 0 || isNewSession(fresh)) {
    firstTouch = { ...firstTouch, ...fresh };
    writeLS(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
  }

  // --- Last touch: reset on every new session ---
  const storedLast = safeParse<{
    attribution: Attribution;
    expires: number;
  }>(readSS(LAST_TOUCH_KEY));
  const now = Date.now();
  const sessionExpired = !storedLast || storedLast.expires < now;

  let lastTouch: Attribution;
  if (isNewSession(fresh) || sessionExpired || !storedLast) {
    lastTouch = fresh;
    writeSS(
      LAST_TOUCH_KEY,
      JSON.stringify({
        attribution: lastTouch,
        expires: now + SESSION_TTL_MS,
      }),
    );
  } else {
    lastTouch = storedLast.attribution;
    // If the URL has new params (e.g. user navigated to a tagged URL mid-session),
    // merge them into lastTouch so we always have the freshest attribution.
    const merged = clean({ ...lastTouch, ...fresh });
    if (JSON.stringify(merged) !== JSON.stringify(lastTouch)) {
      lastTouch = merged;
      writeSS(
        LAST_TOUCH_KEY,
        JSON.stringify({
          attribution: lastTouch,
          expires: now + SESSION_TTL_MS,
        }),
      );
    }
  }

  return { firstTouch, lastTouch };
}

/** Read the current attribution without re-capturing (for server-side forwarding). */
export function getAttribution(): FullAttribution {
  if (typeof window === "undefined") {
    return { firstTouch: {}, lastTouch: {} };
  }
  const firstTouch =
    safeParse<Attribution>(readLS(FIRST_TOUCH_KEY)) || {};
  const storedLast = safeParse<{
    attribution: Attribution;
    expires: number;
  }>(readSS(LAST_TOUCH_KEY));
  const lastTouch = storedLast?.attribution || {};
  return { firstTouch, lastTouch };
}

/** Derive a single human-readable source string from an attribution. */
export function deriveSource(a: Attribution): string {
  if (a.gclid) return "google-ads";
  if (a.fbclid) return "meta-ads";
  if (a.gbp) return "google-business-profile";
  if (a.utm_source) return a.utm_source;
  if (a.referrer) {
    try {
      const host = new URL(a.referrer).hostname;
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
