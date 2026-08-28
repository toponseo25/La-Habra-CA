"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Cookie, Check, X, Info } from "lucide-react";
import { consentGranted, pushEvent, setClarityConsent } from "@/lib/analytics";
import { BUSINESS } from "@/lib/business";
import { trackCtaClick } from "@/lib/analytics";

const CONSENT_KEY = "ras_consent_v1";
const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

type ConsentChoice = "granted" | "denied";

interface StoredConsent {
  choice: ConsentChoice;
  chosenAt: string; // ISO timestamp
}

/**
 * Google Consent Mode v2 — Advanced Mode implementation.
 *
 * Per https://developers.google.com/tag-platform/security/guides/consent
 *
 * BEHAVIOR (Advanced Mode):
 *
 *   1. gtag.js loads UNCONDITIONALLY on every page (see layout.tsx) — even
 *      before the user has made a consent choice. This is the key difference
 *      from Basic Mode (where the tag wouldn't load until consent).
 *
 *   2. Consent defaults are pushed as "denied" BEFORE gtag.js loads. With
 *      consent = denied, gtag.js still sends "consent-less pings"
 *      (cookieless measurement requests) to Google's servers. These pings:
 *        - Have no cookies attached
 *        - Use a temporary client id (not the persisted one)
 *        - Communicate to Google's servers that consent was denied
 *        - Enable Google to MODEL conversions for Google Ads (the whole point
 *          of advanced mode — without these pings, you lose conversion data
 *          in Google Ads for users who don't consent).
 *
 *   3. The user makes an EXPLICIT choice via this banner (not auto-granted):
 *        - "Accept"  -> consentGranted() -> gtag resumes full measurement with
 *                       cookies + the persisted client_id.
 *        - "Reject"  -> consent stays denied -> gtag keeps sending consent-less
 *                       pings (still powers modeled conversions).
 *
 *   4. The choice is persisted to localStorage for 1 year. On subsequent
 *      visits, the stored choice is applied WITHOUT re-showing the banner:
 *        - stored "granted" -> consentGranted() on load
 *        - stored "denied"  -> consent stays denied (pings continue)
 *
 * This is the Google-recommended pattern for any campaign that may expand
 * outside the US (EEA/UK/CH require explicit consent), and is the ONLY way to
 * get modeled conversions in Google Ads when users reject cookies.
 *
 * For a strictly US-only campaign, you could auto-grant — but you'd lose the
 * modeled-conversions benefit and the privacy-friendly default. This banner
 * is the correct, future-proof implementation.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Apply any stored consent choice before deciding whether to show the banner.
    const stored = readStoredConsent();
    if (stored) {
      if (stored.choice === "granted") {
        // Returning visitor who previously accepted — re-apply grant so gtag
        // resumes full measurement immediately on this session. consentGranted()
        // also calls setClarityConsent(true) so Clarity session recording resumes.
        consentGranted();
      } else {
        // Returning visitor who previously rejected — keep consent denied.
        // Explicitly tell Clarity to stay paused (gtag defaults are already
        // denied from layout.tsx bootstrap).
        setClarityConsent(false);
      }
      // Either way, do NOT show the banner again until the stored choice expires.
      return;
    }

    // No stored choice — first visit (or expired). Default BOTH Google Consent
    // Mode (already denied via layout.tsx bootstrap) AND Clarity to denied so
    // no session recording happens until the user explicitly accepts. gtag.js
    // + Clarity both still load and send consent-less pings (advanced consent
    // mode — modeled conversions enabled).
    setClarityConsent(false);
    // Show the banner after a short delay so it doesn't fight the hero animation.
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function handleAccept() {
    writeStoredConsent("granted");
    consentGranted();
    setVisible(false);
    trackCtaClick("Consent Accept", "consent_banner", "scroll");
    pushEvent({
      event: "consent_update",
      payload: { consent_choice: "granted" as const, source: "banner" },
    });
  }

  function handleReject() {
    writeStoredConsent("denied");
    // Don't call consentGranted — leave Google Consent Mode v2 defaults denied.
    // gtag.js keeps sending consent-less pings (which is what powers modeled
    // conversions). Explicitly pause Clarity session recording too.
    setClarityConsent(false);
    setVisible(false);
    trackCtaClick("Consent Reject", "consent_banner", "scroll");
    pushEvent({
      event: "consent_update",
      payload: { consent_choice: "denied" as const, source: "banner" },
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          aria-describedby="consent-body"
          initial={prefersReduced ? false : { y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReduced ? undefined : { y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-[55] md:bottom-6 md:left-6 md:right-auto md:max-w-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="m-3 md:m-0 rounded-2xl bg-slate-950/95 backdrop-blur ring-1 ring-white/15 shadow-2xl overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-teal-400" aria-hidden />

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                  <Cookie className="h-5 w-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    id="consent-title"
                    className="text-base font-bold text-white"
                  >
                    Cookie &amp; privacy preferences
                  </h3>
                  <p
                    id="consent-body"
                    className="mt-1.5 text-sm text-slate-300 leading-relaxed"
                  >
                    We use cookies and similar technologies to measure traffic,
                    improve our services, and show you relevant HVAC information.
                    You can accept all or reject non-essential tracking — either
                    way, you can still request a free estimate or call us.
                  </p>
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-400 leading-relaxed">
                    <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-500" aria-hidden />
                    <span>
                      Your choice is stored for 1 year. See our{" "}
                      <a
                        href={BUSINESS.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                      >
                        privacy policy
                      </a>
                      .
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2.5">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label="Accept all cookies and tracking"
                >
                  <Check className="h-4 w-4" aria-hidden />
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 ring-1 ring-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label=" Reject non-essential cookies"
                >
                  <X className="h-4 w-4" aria-hidden />
                  Reject non-essential
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- localStorage helpers ----------------------------- */

function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    const age = Date.now() - new Date(parsed.chosenAt).getTime();
    if (age > CONSENT_TTL_MS) return null; // expired
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    const stored: StoredConsent = {
      choice,
      chosenAt: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
  } catch {
    /* ignore (private mode / storage full) */
  }
}
