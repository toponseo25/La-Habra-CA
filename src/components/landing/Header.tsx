"use client";

import { useEffect, useState } from "react";
import { Phone, Menu, X, Flame, Snowflake } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { trackClickToCall, trackCtaClick } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Why RAS", href: "#why-ras" },
  { label: "Service Area", href: "#service-area" },
  { label: "Projects", href: "#projects" },
  { label: "FAQ", href: "#faq" },
];

/**
 * Sticky top header — minimal navigation to avoid distracting from the
 * conversion goal. Shows the brand mark, a few in-page nav links, and a
 * persistent click-to-call button (so the phone number is ALWAYS visible,
 * which is a hard requirement for the campaign).
 *
 * Becomes compact (adds a subtle shadow + solid background) once the user
 * scrolls past the hero. On mobile the nav collapses into a simple menu.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-md border-b border-slate-200"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <a
            href="#top"
            className="flex items-center gap-2.5 shrink-0"
            aria-label={`${BUSINESS.name} home`}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <Flame className="h-5 w-5 text-orange-400" aria-hidden />
              <Snowflake className="h-4 w-4 text-teal-300 absolute bottom-1 right-1" aria-hidden />
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

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Page sections"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                {l.label}
              </a>
            ))}
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

          {/* Mobile: call button always visible */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${BUSINESS.phoneTel}`}
              onClick={() => trackClickToCall("header_mobile", BUSINESS.phoneDisplay)}
              className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-bold text-white active:scale-95"
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{BUSINESS.phoneDisplay}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="lg:hidden pb-4 pt-2 border-t border-slate-200"
            aria-label="Page sections (mobile)"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <a
              href="#lead-form"
              onClick={() => {
                setMenuOpen(false);
                trackCtaClick("Free Estimate", "header_mobile_menu", "scroll");
              }}
              className="mt-3 flex items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30"
            >
              Get My Free Estimate
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
