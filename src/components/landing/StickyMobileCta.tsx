"use client";

import { useEffect, useState } from "react";
import { Phone, ClipboardList } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { trackClickToCall, trackCtaClick } from "@/lib/analytics";

/**
 * Sticky mobile CTA bar — fixed to the bottom of the viewport on mobile only.
 * Shows two tappable actions: Call Now (click-to-call) and Free Estimate
 * (scrolls to the lead form). This is the single most important conversion
 * element on a mobile HVAC landing page.
 *
 * Appears after the user scrolls past the hero so it doesn't cover the
 * initial above-the-fold CTAs, and hides once the footer is reached so it
 * never overlaps the bottom contact info.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Show after the first viewport
      const pastHero = window.scrollY > window.innerHeight * 0.6;

      // Hide when the footer (or near it) is in view so it doesn't overlap
      const footer = document.getElementById("site-footer");
      let footerVisible = false;
      if (footer) {
        const rect = footer.getBoundingClientRect();
        footerVisible = rect.top < window.innerHeight;
      }
      setVisible(pastHero && !footerVisible);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
    >
      <div className="border-t border-slate-200 bg-white/95 backdrop-blur shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-2 gap-px">
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            onClick={() => trackClickToCall("sticky_mobile_bar")}
            className="flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white font-bold active:bg-slate-800"
            aria-label={`Call RAS Heating & Air at ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" aria-hidden />
            <span>CALL NOW</span>
          </a>
          <a
            href="#lead-form"
            onClick={() => trackCtaClick("Free Estimate", "sticky_mobile_bar")}
            className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white font-bold active:bg-orange-600"
            aria-label="Scroll to the free estimate form"
          >
            <ClipboardList className="h-5 w-5" aria-hidden />
            <span>FREE ESTIMATE</span>
          </a>
        </div>
      </div>
    </div>
  );
}
