"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Scroll progress bar — a thin gradient bar fixed to the very top of the
 * viewport that fills as the user scrolls down the page. Provides a constant,
 * subtle visual cue of how far through the page the visitor is.
 *
 * Uses framer-motion's useScroll + useSpring for smooth, GPU-accelerated
 * motion (no scroll listeners / layout thrash). Respects reduced-motion
 * (renders a static full-width bar instead of the animated one).
 */
export function ScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) {
    // For reduced-motion users: a static, thin top border accent (no movement).
    return (
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-teal-400 opacity-40"
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-orange-500 via-amber-400 to-teal-400 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
