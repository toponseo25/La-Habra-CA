/**
 * Server-safe CTA button class string helpers.
 *
 * These are intentionally in a module WITHOUT "use client" so they can be
 * called from server components (Hero, OfferSection, FinalCta) without
 * triggering Next.js' "client function called from server" error.
 */

export type CtaVariant = "primary" | "secondary" | "ghost";

export function ctaButtonClass(variant: CtaVariant = "primary"): string {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 active:scale-[0.98] shadow-lg";
  const variants: Record<CtaVariant, string> = {
    // High-contrast orange — the dominant "click me" color across the page.
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30 px-7 py-3.5",
    // Dark slate — used as the "CALL NOW" alternative / sticky header.
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30 px-7 py-3.5",
    // Outlined — used on dark sections where an orange button would be too loud.
    ghost:
      "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur px-7 py-3.5",
  };
  return `${base} ${variants[variant]}`;
}
