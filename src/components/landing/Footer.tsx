import { Flame, Snowflake, Phone, MapPin, Mail, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";

/**
 * Site footer (sticky at the bottom via the page's flex layout). Carries the
 * full NAP (Name, Address, Phone) for local SEO and reinforces trust signals.
 */
export function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-slate-950 text-slate-400 mt-auto"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        RAS Heating & Air contact information and service area
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand + NAP */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Flame className="h-5 w-5 text-orange-400" aria-hidden />
                <Snowflake
                  className="h-4 w-4 text-teal-300 absolute bottom-1 right-1"
                  aria-hidden
                />
              </span>
              <div>
                <p className="text-lg font-extrabold text-white tracking-tight">
                  {BUSINESS.name}
                </p>
                <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold">
                  {BUSINESS.primaryCity}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Reliable heating and air conditioning service for La Habra, CA and
              surrounding neighborhoods. Licensed &amp; insured. {BUSINESS.yearsExperience}{" "}
              years of local experience.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" aria-hidden />
                <span>
                  {BUSINESS.streetAddress}
                  <br />
                  {BUSINESS.addressLocality}, {BUSINESS.addressRegion}{" "}
                  {BUSINESS.postalCode}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-orange-400 shrink-0" aria-hidden />
                <CtaLink
                  mode="call"
                  label={BUSINESS.phoneDisplay}
                  trackingLabel={BUSINESS.phoneDisplay}
                  trackingLocation="footer"
                  className="font-bold text-white hover:text-orange-400 transition-colors"
                />
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-orange-400 shrink-0" aria-hidden />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              HVAC Services
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                "AC Repair",
                "AC Installation & Replacement",
                "Heating & Furnace Repair",
                "HVAC Installation",
                "HVAC Maintenance",
                "Mini-Split Systems",
                "Indoor Air Quality",
                "Emergency HVAC Service",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="hover:text-orange-400 transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area + hours */}
          <div className="md:col-span-4">
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              Service Area
            </p>
            <p className="mt-4 text-sm leading-relaxed">
              {BUSINESS.primaryCity} and approximately {BUSINESS.serviceRadiusMiles}{" "}
              radius — including:
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
              {BUSINESS.serviceAreaCities.slice(0, 8).map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-orange-400" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm font-bold text-white uppercase tracking-wider">
              Hours
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {BUSINESS.hours.map((h) => (
                <li key={h.days} className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 mt-0.5 text-orange-400 shrink-0" aria-hidden />
                  <span>
                    <span className="text-white font-semibold">{h.days}:</span>{" "}
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden />
            <span>
              Licensed &amp; Insured · {BUSINESS.yearsExperience} Years of
              Experience · Locally Owned
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={BUSINESS.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition-colors"
            >
              {BUSINESS.website.replace(/^https?:\/\//, "")}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-600 text-center sm:text-left leading-relaxed">
          © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          *Same-day and emergency service subject to availability, weather, and
          call volume. Serving La Habra, CA and the surrounding ~2–5 mile area.
        </p>
      </div>
    </footer>
  );
}
