import {
  Award,
  ShieldCheck,
  MapPin,
  BadgeDollarSign,
  Zap,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { CtaLink } from "@/components/landing/CtaLink";
import { BUSINESS } from "@/lib/business";
import { Reveal, Stagger, StaggerItem } from "@/components/landing/Motion";

const REASONS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Award,
    title: "Experienced HVAC Professionals",
    body: `${BUSINESS.yearsExperience} years of hands-on experience with California homes — from classic La Habra ranch houses to newer builds. We've seen (and fixed) it all.`,
  },
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    body: "Fully licensed and insured so your home and your project are protected. We carry proper coverage and follow all local codes.",
  },
  {
    icon: MapPin,
    title: "Local Service, Fast Response",
    body: "We're based in and around La Habra — so when your AC goes down on the hottest day of the year, we're close enough to actually get there fast.",
  },
  {
    icon: BadgeDollarSign,
    title: "Upfront Pricing",
    body: "You approve the price before we start. No hourly surprises, no mystery fees, no upsell pressure — just honest options and honest numbers.",
  },
  {
    icon: Zap,
    title: "Fast Response Time",
    body: "We prioritize emergency no-cooling and no-heat calls and keep same-day service slots open across La Habra so you're not stuck waiting.*",
  },
  {
    icon: Sparkles,
    title: "Professional Workmanship",
    body: "We install and repair to manufacturer specs. Clean lines, proper sizing, balanced airflow — the details that keep your system running for years.",
  },
  {
    icon: HeartHandshake,
    title: "Customer-Focused Service",
    body: "We explain what's wrong in plain language, show you the problem, and respect your home. You make the decisions — we give you the facts.",
  },
  {
    icon: CheckCircle2,
    title: "Quality Equipment & Solutions",
    body: "We work with trusted, high-efficiency equipment brands and recommend solutions that actually fit your home, your comfort, and your budget.",
  },
];

/**
 * Why Choose RAS section (brief section #5). Each reason maps to a claim RAS
 * can actually stand behind — no fabricated certifications or guarantees.
 */
export function WhyChooseUs() {
  return (
    <section
      id="why-ras"
      className="bg-slate-950 py-16 sm:py-24 text-white"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="fadeUp">
          <div className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Why La Habra Homeowners Choose RAS
            </p>
            <h2
              id="why-heading"
              className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight"
            >
              A Local HVAC Team You Can Actually Trust
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              Heating and cooling is an investment in your home. Here's why
              La Habra homeowners keep coming back to RAS Heating &amp; Air.
            </p>
          </div>
        </Reveal>

        <Stagger slow className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((r) => (
            <StaggerItem
              key={r.title}
              className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 transition-all hover:bg-white/10 hover:ring-orange-400/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <r.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {r.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        {/* CTA strip */}
        <Reveal variant="fadeUp" delay={0.15}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <p className="text-lg font-semibold text-white">
              Ready for honest HVAC service in La Habra?
            </p>
            <CtaLink
              mode="scroll"
              href="#lead-form"
              label="Get Your Free Estimate"
              trackingLabel="Get Your Free Estimate"
              trackingLocation="why_ras"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
