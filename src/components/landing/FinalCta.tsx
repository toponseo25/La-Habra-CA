import { Phone, ClipboardList, ShieldCheck, Clock, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";
import { ctaButtonClass } from "@/components/landing/ctaStyles";

/**
 * Final CTA section (brief section #10). Strong closing conversion section
 * that repeats the phone number and offers both call + form CTAs.
 */
export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-slate-950 text-white py-20 sm:py-28"
      aria-labelledby="final-cta-heading"
    >
      {/* Subtle radial accent */}
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {BUSINESS.primaryCity}
        </p>
        <h2
          id="final-cta-heading"
          className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
        >
          Need HVAC Service in La Habra?
        </h2>
        <p className="mt-5 text-xl sm:text-2xl font-semibold text-slate-200">
          Let's get your home comfortable again.
        </p>
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Fast, reliable heating &amp; air conditioning service from a local team
          that stands behind its work. Free estimate, upfront pricing, same-day
          service available*.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
          <CtaLink
            mode="call"
            label="CALL RAS HEATING & AIR"
            trackingLabel="Call RAS Heating & Air"
            trackingLocation="final_cta"
            className={ctaButtonClass("primary")}
            ariaLabel={`Call RAS Heating and Air at ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" aria-hidden />
            CALL RAS HEATING &amp; AIR
          </CtaLink>
          <CtaLink
            mode="scroll"
            href="#lead-form"
            label="REQUEST A FREE ESTIMATE"
            trackingLabel="Request a Free Estimate"
            trackingLocation="final_cta"
            className={ctaButtonClass("secondary")}
          >
            <ClipboardList className="h-5 w-5" aria-hidden />
            REQUEST A FREE ESTIMATE
          </CtaLink>
        </div>

        {/* Big phone number */}
        <div className="mt-10">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Call us directly
          </p>
          <CtaLink
            mode="call"
            label={BUSINESS.phoneDisplay}
            trackingLabel={BUSINESS.phoneDisplay}
            trackingLocation="final_cta_big"
            className="mt-1 inline-flex items-center gap-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white hover:text-orange-400 transition-colors"
          >
            <Phone className="h-7 w-7 sm:h-8 sm:w-8 text-orange-400" aria-hidden />
            {BUSINESS.phoneDisplay}
          </CtaLink>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
            Licensed &amp; Insured
          </span>
          <span className="h-3 w-px bg-white/20" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-orange-400" aria-hidden />
            Same-Day Service*
          </span>
          <span className="h-3 w-px bg-white/20" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-teal-400" aria-hidden />
            {BUSINESS.yearsExperience} Years Local Experience
          </span>
        </div>
      </div>
    </section>
  );
}
