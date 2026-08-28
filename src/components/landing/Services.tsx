import {
  Wind,
  Snowflake,
  Flame,
  Wrench,
  CalendarClock,
  AirVent,
  Leaf,
  Siren,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { SERVICES, BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";

const ICONS: Record<string, LucideIcon> = {
  Wind,
  Snowflake,
  Flame,
  Wrench,
  CalendarClock,
  AirVent,
  Leaf,
  Siren,
};

/**
 * HVAC services section — 8 service cards. Each card has a benefit-focused
 * description and a CTA (rendered via the client-side CtaLink component so
 * we get consistent analytics without making the whole section a client
 * component).
 */
export function Services() {
  return (
    <section
      id="services"
      className="bg-white py-16 sm:py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            HVAC Services in La Habra
          </p>
          <h2
            id="services-heading"
            className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Complete Heating &amp; Air Conditioning Service
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From a single AC repair to a full system replacement, RAS Heating
            &amp; Air handles every part of home comfort for La Habra homeowners.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon] ?? Wind;
            return (
              <article
                key={s.slug}
                className="group flex flex-col rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:ring-orange-200 hover:-translate-y-1 overflow-hidden"
              >
                {/* Top accent bar */}
                <div
                  className="h-1.5 bg-gradient-to-r from-orange-500 to-teal-500 opacity-80"
                  aria-hidden
                />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm group-hover:bg-orange-500 transition-colors">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                    {s.short}
                  </p>

                  <CtaLink
                    mode="scroll"
                    href="#lead-form"
                    label={s.cta}
                    trackingLabel={s.cta}
                    trackingLocation={`services_${s.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 group-hover:gap-2.5 transition-all"
                    ariaLabel={`${s.cta} — scroll to the request form`}
                  >
                    {s.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </CtaLink>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-6 sm:p-8">
          <p className="text-base sm:text-lg font-semibold text-slate-900 text-center sm:text-left">
            Not sure what you need? We'll diagnose it and give you honest options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <CtaLink
              mode="scroll"
              href="#lead-form"
              label="Get a Free Estimate"
              trackingLabel="Get a Free Estimate"
              trackingLocation="services_bottom"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95"
            />
            <CtaLink
              mode="call"
              label={`Call ${BUSINESS.phoneDisplay}`}
              trackingLabel={`Call ${BUSINESS.phoneDisplay}`}
              trackingLocation="services_bottom"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 px-6 py-3 text-sm font-bold text-white transition-all active:scale-95"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
