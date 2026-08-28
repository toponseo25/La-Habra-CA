"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Motion primitives for the RAS Heating & Air landing page.
 *
 * A single, opinionated set of reusable animation components + variant presets
 * so the whole page has consistent, professional motion (no per-component
 * bespoke animations that drift apart over time).
 *
 * Design principles:
 *  - Purposeful motion: every animation communicates something (entrance,
 *    hierarchy, feedback). No motion for motion's sake.
 *  - Accessibility-first: all motion respects `prefers-reduced-motion` via
 *    framer-motion's useReducedMotion hook + the global CSS reset.
 *  - Performance: use transform/opacity only (GPU-accelerated, no layout
 *    thrash). IntersectionObserver-driven so off-screen content doesn't burn CPU.
 *  - Stagger: groups of related elements animate together with a small delay
 *    between each item so the eye can follow the hierarchy.
 */

/* ----------------------------- Variant presets ----------------------------- */

/** Fade + slide up — the workhorse reveal animation. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fade + slide in from the left (for split-section content). */
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Fade + slide in from the right (for split-section images/cards). */
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Pure fade — for overlays, badges, and subtle reveals. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/** Scale-in — for badges, pills, and the success state. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 18 },
  },
};

/** Stagger container — wraps children that should animate in sequence. */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Stagger container with a longer delay between children (for cards). */
export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/* ----------------------- Reduced-motion-aware variants ----------------------- */

/**
 * Returns the no-motion variants (everything visible, no transform) for users
 * who prefer reduced motion. Use via the `useMotionVariants` hook in any
 * component that animates.
 */
const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0 } },
};

/** Hook: returns the requested variant OR a no-op variant if reduced motion. */
export function useMotionVariants(variant: Variants): Variants {
  const prefersReduced = useReducedMotion();
  return prefersReduced ? reducedVariants : variant;
}

/* ----------------------------- Reveal components ----------------------------- */

type RevealProps = {
  children: ReactNode;
  /** Variant to use. Defaults to fadeUp. */
  variant?: "fadeUp" | "fadeLeft" | "fadeRight" | "fade" | "scaleIn";
  /** Delay (seconds) before the animation starts. Useful for sequenced reveals. */
  delay?: number;
  /** When true, animates immediately on mount instead of on scroll. */
  immediate?: boolean;
  /** Extra className for the wrapper element. */
  className?: string;
  /** Render as a different element (default: div). */
  as?: "div" | "section" | "article" | "li" | "span";
};

/**
 * Reveal-on-scroll wrapper. Animates its children when they enter the viewport
 * (via IntersectionObserver, no scroll listeners). Respects reduced-motion.
 *
 * Usage:
 *   <Reveal><Card /></Reveal>
 *   <Reveal variant="fadeRight" delay={0.2}><Image /></Reveal>
 */
export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  immediate = false,
  className,
  as = "div",
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const variantMap = {
    fadeUp,
    fadeLeft,
    fadeRight,
    fade,
    scaleIn,
  };

  // For reduced motion: render the children with no animation wrapper.
  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];
  const selected = variantMap[variant];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      // immediate = animate on mount (for above-the-fold content); otherwise
      // wait until the element scrolls into view.
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: selected.hidden,
        visible: {
          ...selected.visible,
          transition: delay
            ? { ...(selected.visible as any).transition, delay }
            : (selected.visible as any).transition,
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/* --------------------------- Stagger container --------------------------- */

type StaggerProps = {
  children: ReactNode;
  /** Slower stagger for larger card grids. */
  slow?: boolean;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
  immediate?: boolean;
};

/**
 * Stagger container — wraps a group of children that should animate in
 * sequence. Each direct child should be a <StaggerItem> (or use the
 * `variants` prop manually).
 *
 * Usage:
 *   <Stagger>
 *     <StaggerItem>Card 1</StaggerItem>
 *     <StaggerItem>Card 2</StaggerItem>
 *   </Stagger>
 */
export function Stagger({
  children,
  slow = false,
  className,
  as = "div",
  immediate = false,
}: StaggerProps) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={slow ? staggerContainerSlow : staggerContainer}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  variant?: "fadeUp" | "fadeLeft" | "fadeRight" | "fade" | "scaleIn";
  as?: "div" | "article" | "li" | "span";
};

/** Child of <Stagger> — inherits the stagger timing from its parent. */
export function StaggerItem({
  children,
  className,
  variant = "fadeUp",
  as = "div",
}: StaggerItemProps) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const MotionTag = motion[as];
  const variantMap = { fadeUp, fadeLeft, fadeRight, fade, scaleIn };
  return (
    <MotionTag className={className} variants={variantMap[variant]}>
      {children}
    </MotionTag>
  );
}

/* ----------------------------- Hover lift ----------------------------- */

/**
 * Hover-lift wrapper — adds a subtle translateY + shadow boost on hover.
 * For cards, list items, and any element that should feel "pressable".
 *
 * Combines with the static hover classes (hover:shadow-xl etc.) — this adds
 * the spring-eased transform on top.
 */
export function HoverLift({
  children,
  className,
  lift = 6,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
