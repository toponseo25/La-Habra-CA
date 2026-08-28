import { Phone, Star, ShieldCheck, Clock, BadgeDollarSign, MapPin, Wrench, Flame, Snowflake } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";
import { ctaButtonClass } from "@/components/landing/ctaStyles";

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: "Licensed & Insured" },
  { icon: Wrench, label: `${BUSINESS.yearsExperience} Years Experience` },
  { icon: Clock, label: "Same-Day Service*" },
  { icon: BadgeDollarSign, label: "Upfront Pricing" },
  { icon: MapPin, label: "Local HVAC Pros" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-slate-900 text-white"
      aria-labelledby="hero-heading"
    >
      {/* Background image with overlay for readability + premium feel */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-technician.jpg"
          alt="RAS Heating & Air HVAC technician servicing an outdoor air conditioner condenser unit at a La Habra, CA home"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-3xl">
          {/* Local badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-white">
            <MapPin className="h-3.5 w-3.5 text-orange-400" aria-hidden />
            Serving La Habra, CA &amp; nearby communities
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
          >
            Reliable HVAC Service in{" "}
            <span className="text-orange-400">La Habra, CA</span>
          </h1>

          {/* Supporting copy */}
          <p className="mt-5 text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed">
            Fast, professional heating and air conditioning service for
            homeowners in La Habra and surrounding neighborhoods. AC repair,
            AC replacement, furnace repair, mini-splits &amp; emergency HVAC
            service — done right.
          </p>

          {/* Phone (very prominent, as required) */}
          <div className="mt-7 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">
              Call us right now:
            </span>
            <CtaLink
              mode="call"
              label={BUSINESS.phoneDisplay}
              trackingLabel={BUSINESS.phoneDisplay}
              trackingLocation="hero"
              className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-extrabold text-white hover:text-orange-400 transition-colors"
              ariaLabel={`Call RAS Heating and Air at ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-6 w-6 sm:h-7 sm:w-7 text-orange-400" aria-hidden />
              {BUSINESS.phoneDisplay}
            </CtaLink>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <CtaLink
              mode="scroll"
              label="GET A FREE ESTIMATE"
              trackingLabel="Get Free Estimate"
              trackingLocation="hero"
              className={ctaButtonClass("primary")}
            />
            <CtaLink
              mode="call"
              label="CALL NOW"
              trackingLabel="Call Now"
              trackingLocation="hero"
              className={ctaButtonClass("secondary")}
            />
          </div>

          {/* Trust indicators */}
          <ul className="mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 max-w-3xl">
            {TRUST_INDICATORS.map((t) => (
              <li
                key={t.label}
                className="flex items-center gap-2 text-sm font-medium text-slate-100"
              >
                <t.icon className="h-4 w-4 text-orange-400 shrink-0" aria-hidden />
                <span>{t.label}</span>
              </li>
            ))}
          </ul>

          {/* Star rating trust line (no fabricated count) */}
          <p className="mt-5 flex items-center gap-2 text-sm text-slate-300">
            <span className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                />
              ))}
            </span>
            Trusted by La Habra homeowners — see what customers say below.
          </p>
        </div>
      </div>

      {/* Decorative flame/snowflake accent strip showing heating + cooling duality */}
      <div className="relative border-t border-white/10 bg-slate-950/40 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-400" aria-hidden />
            Heating
          </span>
          <span className="h-3 w-px bg-white/20" aria-hidden />
          <span className="flex items-center gap-1.5">
            <Snowflake className="h-4 w-4 text-teal-300" aria-hidden />
            Air Conditioning
          </span>
          <span className="h-3 w-px bg-white/20 hidden sm:block" aria-hidden />
          <span className="hidden sm:inline text-slate-400">
            One call for total home comfort in La Habra
          </span>
        </div>
      </div>
    </section>
  );
}
