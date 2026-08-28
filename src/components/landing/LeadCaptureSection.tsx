import { Check, Phone, Clock, ShieldCheck, Star } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { LeadForm } from "@/components/landing/LeadForm";
import { CtaLink } from "@/components/landing/CtaLink";
import { Reveal, Stagger, StaggerItem } from "@/components/landing/Motion";

const WHAT_HAPPENS = [
  "You submit your request in under a minute",
  "We call you back to confirm the best appointment time",
  "A technician diagnoses your system & gives you upfront pricing",
  "You decide — repair, replace, or just get the assessment",
];

const SIDE_TRUST = [
  { icon: ShieldCheck, label: "Licensed & Insured" },
  { icon: Clock, label: "Same-Day Service*" },
  { icon: Star, label: "Experienced Local Pros" },
];

/**
 * Lead capture section (brief section #3).
 *
 * Two-column layout on desktop: persuasive pitch on the left, the actual
 * LeadForm component on the right. The form is the `#lead-form` anchor
 * target that every other CTA on the page scrolls to.
 */
export function LeadCaptureSection() {
  return (
    <section
      id="estimate"
      className="relative bg-gradient-to-b from-slate-100 to-white py-16 sm:py-24"
      aria-labelledby="lead-section-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Pitch column */}
          <Reveal variant="fadeLeft" className="lg:col-span-5 lg:sticky lg:top-24">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" aria-hidden />
                Free, No-Obligation Estimate
              </p>
              <h2
                id="lead-section-heading"
                className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
              >
                Get Your Free HVAC Estimate in La Habra
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Thinking about repairing or replacing your HVAC system? Tell us
                what's going on and we'll send a professional to assess your home —
                no pressure, no surprise fees.
              </p>

              <Stagger className="mt-6 space-y-3">
                {WHAT_HAPPENS.map((step) => (
                  <StaggerItem
                    key={step}
                    as="li"
                    className="flex items-start gap-3 list-none"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                    </span>
                    <span className="text-slate-700">{step}</span>
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {SIDE_TRUST.map((t) => (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700"
                  >
                    <t.icon className="h-4 w-4 text-orange-600" aria-hidden />
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-sm font-semibold text-slate-300">
                  Prefer to talk now?
                </p>
                <CtaLink
                  mode="call"
                  label={BUSINESS.phoneDisplay}
                  trackingLabel={BUSINESS.phoneDisplay}
                  trackingLocation="lead_section"
                  className="mt-1 inline-flex items-center gap-2 text-2xl font-extrabold text-white hover:text-orange-400 transition-colors"
                >
                  <Phone className="h-5 w-5 text-orange-400" aria-hidden />
                  {BUSINESS.phoneDisplay}
                </CtaLink>
                <p className="mt-2 text-xs text-slate-400">
                  Fast response for La Habra homeowners. We answer the phone.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal variant="fadeRight" delay={0.15} className="lg:col-span-7">
            <LeadForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
