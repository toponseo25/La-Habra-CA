"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics";

/**
 * Floating "back to top" button. Appears after the user scrolls past the
 * first viewport, and hides when the footer is reached so it never overlaps
 * the bottom contact info (same hide logic as the sticky mobile CTA bar).
 *
 * Useful on a long landing page — saves the visitor from scrolling all the
 * way back up to reach the hero / nav. Disabled entirely on mobile (the
 * sticky mobile call bar already owns the bottom area there).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      const pastHero = window.scrollY > window.innerHeight * 0.8;
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

  if (prefersReduced) {
    return visible ? (
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "auto" });
          trackCtaClick("Back to Top", "back_to_top", "scroll");
        }}
        className="hidden md:flex fixed bottom-6 right-6 z-40 h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-white/10 hover:bg-slate-800"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </button>
    ) : null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            trackCtaClick("Back to Top", "back_to_top", "scroll");
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="hidden md:flex fixed bottom-6 right-6 z-40 h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-white/10 hover:bg-slate-800"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
