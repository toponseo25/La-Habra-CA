import { Clock, BadgeDollarSign, Sparkles, Award, ExternalLink, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";
import { Reveal, Stagger, StaggerItem } from "@/components/landing/Motion";

const QUALITY_PROMISES = [
  {
    icon: Clock,
    title: "On-Time, Fast Response",
    body: "We respect your time. We show up in the scheduled window and communicate clearly if anything changes — so you're never waiting around.",
  },
  {
    icon: BadgeDollarSign,
    title: "Upfront, Honest Pricing",
    body: "You approve the price before we start. No surprise fees, no upsell pressure — just clear options for repair vs. replacement.",
  },
  {
    icon: Sparkles,
    title: "Clean, Respectful Work",
    body: "We treat your home like ours: drop cloths, shoe covers, and a tidy work area. We clean up before we leave.",
  },
  {
    icon: Award,
    title: "Skilled, Local Technicians",
    body: "Experienced HVAC professionals who know California homes and code — and stand behind their workmanship.",
  },
];

/**
 * Local trust / social proof section.
 *
 * NOTE ON REVIEW DATA: Per the campaign brief, we do NOT fabricate testimonials,
 * ratings, certifications, or customer counts. Instead this section shows
 * (1) the real experience the team delivers, (2) real project photography,
 * (3) a direct link to read verified reviews on the RAS Google Business
 * Profile — so visitors can see real, attributable reviews without us
 * putting invented quotes or numbers on the page.
 *
 * Motion: header fades up on scroll, technician photo reveals from the left,
 * the 4 promise cards stagger in from the right.
 */
export function SocialProof() {
  return (
    <section
      id="trust"
      className="bg-slate-50 py-16 sm:py-20"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="fadeUp">
          <div className="text-center max-w-2xl mx-auto">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              La Habra Local HVAC
            </p>
            <h2
              id="trust-heading"
              className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
            >
              Trusted HVAC Service for La Habra Homeowners
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Real projects, real workmanship, and a team that lives and works in
              your community. Here's what you can expect when RAS Heating &amp; Air
              shows up at your door.
            </p>
          </div>
        </Reveal>

        {/* Technician + promises */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <Reveal variant="fadeLeft" className="lg:col-span-5">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200 bg-white">
                <img
                  src="/images/technician-portrait.jpg"
                  alt="RAS Heating & Air HVAC technician in uniform standing beside a service van, ready to help La Habra homeowners"
                  className="w-full h-[340px] sm:h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating local badge */}
              <div className="absolute -bottom-4 -left-4 hidden sm:block rounded-xl bg-slate-900 text-white px-5 py-3 shadow-lg">
                <p className="text-xs uppercase tracking-wider text-orange-400 font-bold">
                  Locally Based
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  Serving La Habra, CA
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Stagger slow>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUALITY_PROMISES.map((q) => (
                  <StaggerItem
                    key={q.title}
                    as="li"
                    className="group rounded-xl bg-white p-5 ring-1 ring-slate-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <q.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {q.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {q.body}
                    </p>
                  </StaggerItem>
                ))}
              </ul>
            </Stagger>
          </div>
        </div>

        {/* Read verified reviews CTA (no fabricated counts/quotes) */}
        <Reveal variant="fadeUp" delay={0.1}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-base text-slate-700">
              Want to hear from real La Habra homeowners?
            </p>
            <CtaLink
              mode="link"
              href={BUSINESS.googleBusinessProfileUrl}
              external
              label="Read verified reviews on Google"
              trackingLabel="Read Reviews on Google"
              trackingLocation="social_proof"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition-colors"
            >
              Read verified reviews on Google
              <ExternalLink className="h-4 w-4" aria-hidden />
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
