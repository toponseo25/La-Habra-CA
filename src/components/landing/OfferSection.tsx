import { Phone, Sparkles, ArrowRight, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";

/**
 * Offer section (brief section #7) — visually prominent band promoting the
 * FREE HVAC ESTIMATE offer. Re-promotes the lead form and reinforces the
 * phone number. This is the mid-page conversion reinforcement.
 */
export function OfferSection() {
  return (
    <section
      id="offer"
      className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white py-16 sm:py-20"
      aria-labelledby="offer-heading"
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Limited-Time Offer for La Habra Homeowners
            </span>
            <h2
              id="offer-heading"
              className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              FREE HVAC Estimate
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed">
              Thinking about repairing or replacing your HVAC system? Get a
              professional assessment from RAS Heating &amp; Air — we'll give you
              honest options and upfront pricing, with zero obligation.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/95">
              <li className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden /> Same-day service available*
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4" aria-hidden /> No obligation, ever
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" aria-hidden /> Licensed &amp; insured
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <CtaLink
                mode="scroll"
                href="#lead-form"
                label="GET MY FREE ESTIMATE"
                trackingLabel="Get My Free Estimate"
                trackingLocation="offer_section"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 px-8 py-4 text-base font-bold text-white shadow-xl transition-all active:scale-95"
              />
              <CtaLink
                mode="call"
                label={`CALL ${BUSINESS.phoneDisplay}`}
                trackingLabel={`Call ${BUSINESS.phoneDisplay}`}
                trackingLocation="offer_section"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-100 px-8 py-4 text-base font-bold text-orange-600 shadow-xl transition-all active:scale-95"
              />
            </div>
          </div>

          {/* Right card: fast response promise */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white/10 ring-1 ring-white/30 backdrop-blur p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-white/80">
                What you get
              </p>
              <ul className="mt-4 space-y-4">
                {[
                  {
                    title: "A real technician at your home",
                    body: "Not a salesperson — someone who actually diagnoses HVAC systems daily.",
                  },
                  {
                    title: "Clear repair vs. replacement options",
                    body: "We lay out what's wrong, what it costs, and when replacement makes more sense.",
                  },
                  {
                    title: "Upfront, no-surprise pricing",
                    body: "You approve the price before any work begins. Period.",
                  },
                ].map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white text-orange-600 font-bold text-sm">
                      ✓
                    </span>
                    <div>
                      <p className="font-bold">{b.title}</p>
                      <p className="text-sm text-white/85 mt-0.5 leading-relaxed">
                        {b.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
