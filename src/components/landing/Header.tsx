"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Phone, Menu, X, Flame, Snowflake } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { trackClickToCall, trackCtaClick } from "@/lib/analytics";
import { useScrollSpy, type SectionId } from "@/hooks/use-scroll-spy";

const NAV_LINKS: { label: string; href: string; id: SectionId }[] = [
  { label: "Services", href: "#services", id: "services" },
  { label: "Why RAS", href: "#why-ras", id: "why-ras" },
  { label: "Service Area", href: "#service-area", id: "service-area" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

const ALL_SECTION_IDS: SectionId[] = [
  "top",
  "trust",
  "estimate",
  "services",
  "why-ras",
  "service-area",
  "offer",
  "projects",
  "faq",
  "final-cta",
];

/**
 * Sticky top header — minimal navigation to avoid distracting from the
 * conversion goal. Shows the brand mark, a few in-page nav links, and a
 * persistent click-to-call button (so the phone number is ALWAYS visible).
 *
 * Motion + navigation improvements:
 *  - Scroll-spy active section highlighting (orange underline slides between
 *    nav links via layoutId shared-element transition)
 *  - Condensed mode: header shrinks + adds shadow once past the hero
 *  - Mobile menu slides + fades in (AnimatePresence) instead of popping
 *  - Smooth scroll handled globally by html { scroll-behavior: smooth }
 *  - All motion respects prefers-reduced-motion
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useScrollSpy(ALL_SECTION_IDS);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape for keyboard accessibility
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the mobile menu is open so users don't scroll
    // the page behind it by accident.
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: SectionId) => {
      // Let the browser handle the smooth scroll (via CSS scroll-behavior).
      // We just close the mobile menu + fire analytics.
      setMenuOpen(false);
      trackCtaClick(
        `Nav: ${NAV_LINKS.find((l) => l.id === id)?.label ?? "Section"}`,
        "header_nav",
        "scroll",
      );
      // Don't preventDefault — native anchor + CSS smooth scroll is the most
      // accessible + performant approach.
    },
    [],
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-md border-b border-slate-200"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Brand */}
          <a
            href="#top"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label={`${BUSINESS.name} home`}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
              <Flame className="h-5 w-5 text-orange-400" aria-hidden />
              <Snowflake
                className="h-4 w-4 text-teal-300 absolute bottom-1 right-1"
                aria-hidden
              />
              <span className="sr-only">{BUSINESS.name}</span>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                RAS Heating &amp; Air
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-orange-600">
                La Habra, CA
              </span>
            </span>
          </a>

          {/* Desktop nav — scroll-spy active highlighting */}
          <nav
            className="hidden lg:flex items-center gap-1 relative"
            aria-label="Page sections"
          >
            {NAV_LINKS.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href, l.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-orange-600"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {l.label}
                  {/* Animated active underline — uses layoutId so it slides
                      smoothly between links instead of re-mounting. */}
                  {isActive && !prefersReduced && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-orange-500 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {isActive && prefersReduced && (
                    <span
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-orange-500 rounded-full"
                      aria-hidden
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${BUSINESS.phoneTel}`}
              onClick={() => trackClickToCall("header", BUSINESS.phoneDisplay)}
              className="flex items-center gap-2 text-slate-900 hover:text-orange-600 transition-colors"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Phone className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-bold tracking-tight">
                {BUSINESS.phoneDisplay}
              </span>
            </a>
            <a
              href="#lead-form"
              onClick={() => trackCtaClick("Free Estimate", "header", "scroll")}
              className="inline-flex items-center rounded-full bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95"
            >
              Free Estimate
            </a>
          </div>

          {/* Mobile: call button + menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${BUSINESS.phoneTel}`}
              onClick={() => trackClickToCall("header_mobile", BUSINESS.phoneDisplay)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-bold text-white active:scale-95 transition-transform"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{BUSINESS.phoneDisplay}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="x"
                    initial={prefersReduced ? false : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReduced ? undefined : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={prefersReduced ? false : { rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={prefersReduced ? undefined : { rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" aria-hidden />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide + fade in via AnimatePresence */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={prefersReduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
            aria-label="Page sections (mobile)"
          >
            <div className="px-4 sm:px-6 py-4">
              <div className="grid grid-cols-2 gap-1.5">
                {NAV_LINKS.map((l) => {
                  const isActive = activeSection === l.id;
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href, l.id)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </div>
              <a
                href="#lead-form"
                onClick={() => {
                  setMenuOpen(false);
                  trackCtaClick("Free Estimate", "header_mobile_menu", "scroll");
                }}
                className="mt-3 flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
              >
                Get My Free Estimate
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
