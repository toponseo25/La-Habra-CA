import { MapPin, Navigation, Building2, Phone, CheckCircle2 } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { CtaLink } from "@/components/landing/CtaLink";

/**
 * Local Service Area section (brief section #6).
 *
 * Primary focus: La Habra, CA with an approximately 2–5 mile service radius.
 * We list only the nearby communities RAS actually serves — no misleading
 * doorway-style location spam. The visual is a stylized radius map (CSS-only,
 * no external map dependency) with La Habra at the center.
 */
export function ServiceArea() {
  return (
    <section
      id="service-area"
      className="bg-white py-16 sm:py-24"
      aria-labelledby="service-area-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy + city list */}
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
              <Navigation className="h-3.5 w-3.5" aria-hidden />
              Local Service Area
            </p>
            <h2
              id="service-area-heading"
              className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
            >
              Serving La Habra &amp; Nearby Communities
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Our primary focus is{" "}
              <strong className="text-slate-900">La Habra, CA</strong> and an
              approximately <strong className="text-slate-900">{BUSINESS.serviceRadiusMiles}</strong>{" "}
              service radius. We're a local team — which means fast response
              times and technicians who know your neighborhood.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {BUSINESS.serviceAreaCities.map((city, i) => (
                <div
                  key={city}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ${
                    i === 0
                      ? "bg-orange-50 ring-1 ring-orange-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <CheckCircle2
                    className={`h-4 w-4 flex-shrink-0 ${
                      i === 0 ? "text-orange-600" : "text-emerald-600"
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`text-sm font-semibold ${
                      i === 0 ? "text-orange-700" : "text-slate-700"
                    }`}
                  >
                    {city}
                    {i === 0 && (
                      <span className="ml-1.5 text-[10px] uppercase tracking-wider text-orange-600 font-bold">
                        Primary
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Not sure if you're in our area? Reach out — we'll confirm
              serviceability for your specific address.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <CtaLink
                mode="scroll"
                href="#lead-form"
                label="Check My Address"
                trackingLabel="Check My Address"
                trackingLocation="service_area"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95"
              />
              <CtaLink
                mode="call"
                label={`Call ${BUSINESS.phoneDisplay}`}
                trackingLabel={`Call ${BUSINESS.phoneDisplay}`}
                trackingLocation="service_area"
                className="inline-flex items-center gap-2 justify-center rounded-full bg-slate-900 hover:bg-slate-800 px-6 py-3 text-sm font-bold text-white transition-all active:scale-95"
              />
            </div>
          </div>

          {/* Right: stylized radius map */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Outer radius ring */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100 to-orange-100 ring-1 ring-slate-200"
                aria-hidden
              />
              {/* Middle ring */}
              <div
                className="absolute inset-[12%] rounded-full bg-white shadow-inner ring-1 ring-slate-200"
                aria-hidden
              />
              {/* Inner core */}
              <div
                className="absolute inset-[34%] rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-xl"
                aria-hidden
              >
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="mt-1 text-xs font-bold tracking-tight">
                  La Habra
                </span>
                <span className="text-[10px] text-slate-400">CA · 90631</span>
              </div>

              {/* Surrounding city pins */}
              {[
                { label: "Brea", angle: 35 },
                { label: "Fullerton", angle: 105 },
                { label: "Buena Park", angle: 175 },
                { label: "Whittier", angle: 245 },
                { label: "La Mirada", angle: 315 },
              ].map((pin) => {
                const r = 42; // % from center
                const rad = (pin.angle * Math.PI) / 180;
                const x = 50 + r * Math.cos(rad);
                const y = 50 + r * Math.sin(rad);
                return (
                  <div
                    key={pin.label}
                    className="absolute flex items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    aria-hidden
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white ring-2 ring-orange-400 shadow-md">
                      <Building2 className="h-3.5 w-3.5 text-orange-600" />
                    </span>
                    <span className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200 whitespace-nowrap">
                      {pin.label}
                    </span>
                  </div>
                );
              })}

              {/* Radius label */}
              <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200">
                ~{BUSINESS.serviceRadiusMiles} radius
              </div>
            </div>

            {/* Quick contact card under map */}
            <div className="mt-6 rounded-xl bg-slate-50 ring-1 ring-slate-200 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    La Habra dispatch line
                  </p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {BUSINESS.phoneDisplay}
                  </p>
                </div>
              </div>
              <CtaLink
                mode="call"
                label="Call"
                trackingLabel="Call"
                trackingLocation="service_area_map"
                className="rounded-full bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-bold text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
