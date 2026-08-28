import { ArrowRight, Wrench, Snowflake, Flame, AirVent } from "lucide-react";
import { CtaLink } from "@/components/landing/CtaLink";
import { BUSINESS } from "@/lib/business";

const PROJECTS = [
  {
    image: "/images/project-ac-install.jpg",
    title: "AC Replacement — La Habra, CA",
    summary:
      "Removed an aging 3-ton condenser and installed a new high-efficiency unit on a fresh composite pad with new copper lineset and electrical disconnect.",
    tag: "AC Installation",
    icon: Snowflake,
  },
  {
    image: "/images/project-furnace.jpg",
    title: "High-Efficiency Furnace Upgrade",
    summary:
      "Replaced an older 80% furnace with a new 96% AFUE high-efficiency unit, including PVC venting, proper condensate drainage, and a new smart thermostat.",
    tag: "Heating",
    icon: Flame,
  },
  {
    image: "/images/project-minisplit.jpg",
    title: "Ductless Mini-Split Installation",
    summary:
      "Added a single-zone ductless mini-split to a converted room that never got comfortable with the central system — quiet, efficient, and zoned control.",
    tag: "Mini-Split",
    icon: AirVent,
  },
  {
    image: "/images/hero-technician.jpg",
    title: "Same-Day AC Repair & Tune-Up",
    summary:
      "Diagnosed a refrigerant undercharge on a hot afternoon, repaired the leak, recharged the system, and completed a full performance tune-up to restore comfort.",
    tag: "AC Repair",
    icon: Wrench,
  },
];

/**
 * Project showcase section (brief section #8). Shows real project-style
 * imagery with short, honest descriptions of the work performed. No
 * fabricated before/after claims — each project is described by what was
 * actually done.
 */
export function ProjectShowcase() {
  return (
    <section
      id="projects"
      className="bg-slate-50 py-16 sm:py-24"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            Recent Work
          </p>
          <h2
            id="projects-heading"
            className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Real HVAC Projects in &amp; Around La Habra
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A look at the kind of work we do for La Habra homeowners every week —
            from quick repairs to full system replacements.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative overflow-hidden aspect-[16/9]">
                <img
                  src={p.image}
                  alt={`${p.title} — ${p.summary}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  <p.icon className="h-3.5 w-3.5 text-orange-400" aria-hidden />
                  {p.tag}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {p.summary}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <CtaLink
            mode="scroll"
            href="#lead-form"
            label="Get a Free Estimate on My Project"
            trackingLabel="Get a Free Estimate on My Project"
            trackingLocation="projects"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95"
          >
            Get a Free Estimate on My Project
            <ArrowRight className="h-4 w-4" aria-hidden />
          </CtaLink>
          <p className="mt-3 text-sm text-slate-500">
            Or call{" "}
            <CtaLink
              mode="call"
              label={BUSINESS.phoneDisplay}
              trackingLabel={BUSINESS.phoneDisplay}
              trackingLocation="projects"
              className="font-bold text-slate-700 underline underline-offset-4 hover:text-orange-600"
            />
          </p>
        </div>
      </div>
    </section>
  );
}
