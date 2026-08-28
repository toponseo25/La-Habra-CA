import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BUSINESS } from "@/lib/business";
import { AnalyticsProvider } from "@/components/landing/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * SEO metadata for the RAS Heating & Air La Habra lead-generation landing page.
 * Optimized for the local HVAC keywords the campaign targets, with a clear
 * SEO title, meta description, canonical URL, and Open Graph / Twitter cards.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.website),
  title:
    "HVAC Repair & AC Installation in La Habra, CA | RAS Heating & Air",
  description:
    "Fast, reliable HVAC service in La Habra, CA — AC repair, AC installation & replacement, heating & furnace repair, HVAC maintenance, mini-splits & emergency service. Licensed & insured. 12+ years of experience. Get a FREE estimate today.",
  keywords: [
    "HVAC La Habra",
    "HVAC repair La Habra",
    "AC repair La Habra",
    "AC installation La Habra",
    "HVAC installation La Habra",
    "heating repair La Habra",
    "furnace repair La Habra",
    "HVAC replacement La Habra",
    "mini split installation La Habra",
    "emergency HVAC La Habra",
    "RAS Heating & Air",
    "air conditioning repair La Habra CA",
    "HVAC contractor La Habra",
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: BUSINESS.website,
  },
  category: "Home Services",
  openGraph: {
    title:
      "HVAC Repair & AC Installation in La Habra, CA | RAS Heating & Air",
    description:
      "Fast, reliable HVAC service in La Habra, CA — AC repair, AC installation, heating & furnace repair, mini-splits & emergency service. Get a FREE estimate today.",
    url: BUSINESS.website,
    siteName: BUSINESS.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-technician.jpg",
        width: 1344,
        height: 768,
        alt: "RAS Heating & Air HVAC technician servicing an outdoor AC condenser unit in La Habra, CA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HVAC Repair & AC Installation in La Habra, CA | RAS Heating & Air",
    description:
      "Fast, reliable HVAC service in La Habra, CA. Licensed & insured. 12+ years of experience. Get a FREE estimate today.",
    images: ["/images/hero-technician.jpg"],
  },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "La Habra, California",
    "geo.position": "33.9312;-117.9461",
    "ICBM": "33.9312, -117.9461",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

/**
 * JSON-LD structured data describing RAS Heating & Air as a local HVAC
 * business serving La Habra, CA. This powers the LocalBusiness / HVAC
 * rich results in Google and is what enables the page to appear in local
 * search and Google Business Profile panels.
 */
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "@id": `${BUSINESS.website}#business`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  url: BUSINESS.website,
  telephone: BUSINESS.phoneTel,
  email: BUSINESS.email,
  image: `${BUSINESS.website}/images/hero-technician.jpg`,
  logo: `${BUSINESS.website}/images/hero-technician.jpg`,
  description:
    "RAS Heating & Air provides fast, reliable HVAC repair, AC installation, heating & furnace repair, mini-split installation, and emergency HVAC service to homeowners in La Habra, CA and surrounding communities.",
  priceRange: "$$",
  areaServed: BUSINESS.serviceAreaCities.map((c) => ({
    "@type": "City",
    name: c,
  })),
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.streetAddress,
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.9312,
    longitude: -117.9461,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "17:00",
    },
  ],
  // sameAs: only include URLs that are ACTUAL RAS profiles (Google's
  // guidelines warn against listing generic social homepages here). Until RAS
  // provides real Facebook/Instagram profile URLs, we list only the GBP link.
  sameAs: [BUSINESS.googleBusinessProfileUrl],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "HVAC Services for La Habra Homeowners",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AC Installation & Replacement" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Heating & Furnace Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "HVAC Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "HVAC Maintenance" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mini-Split Systems" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Indoor Air Quality" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency HVAC Service" } },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does HVAC repair cost in La Habra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HVAC repair costs in La Habra depend on the part, system type, and warranty status. A diagnostic service call with RAS Heating & Air includes a full system assessment and upfront, no-surprise pricing before any work begins — so you approve the cost before we start. We always quote the repair vs. replacement trade-off so you can make the best call for your home.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can an HVAC technician come out?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RAS Heating & Air offers same-day service* across La Habra and surrounding neighborhoods for most repair requests, and we prioritize emergency no-cooling and no-heat calls. The fastest way to get on the schedule is to call us directly or submit a free estimate request on this page.",
      },
    },
    {
      "@type": "Question",
      name: "When should I replace my AC system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most central AC systems last about 10–15 years. We typically recommend replacement when your system is over 10 years old, needs frequent repairs, uses R-22 refrigerant, or your summer cooling bills keep climbing. A professional assessment can confirm whether a repair or replacement makes the most financial sense for your home.",
      },
    },
    {
      "@type": "Question",
      name: "How often should my HVAC system be serviced?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend professional maintenance twice a year — once in spring for cooling and once in fall for heating. Routine tune-ups keep your system efficient, extend equipment life, and catch small problems before they become expensive repairs.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide emergency HVAC service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. RAS Heating & Air prioritizes emergency HVAC calls across La Habra and nearby communities — including no-cooling emergencies on hot days and no-heat situations on cold nights. Call us directly for the fastest response.",
      },
    },
    {
      "@type": "Question",
      name: "Do you install mini-split systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We size, install, and service single-zone and multi-zone ductless mini-split systems in La Habra homes. Mini-splits are a quiet, efficient option for additions, converted garages, or rooms that never get comfortable with your central system.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if my AC needs repair or replacement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common signs your AC needs attention: warm air from the vents, weak airflow, strange noises or odors, short cycling, higher-than-normal bills, or frequent repairs. If your system is over 10 years old and the repair cost is significant, a replacement is often the better long-term value — we'll lay out both options clearly.",
      },
    },
    {
      "@type": "Question",
      name: "What areas around La Habra do you service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our primary service area is La Habra, CA and an approximately 2–5 mile radius — including La Habra Heights, Brea, Fullerton, Buena Park, Placentia, Whittier, La Mirada, Rowland Heights, and Hacienda Heights. If you're nearby, reach out and we'll confirm serviceability for your address.",
      },
    },
  ],
};

// Tracking script helpers. These render conditionally based on whether the IDs
// in BUSINESS have been replaced with real values, so the page ships zero
// tracking when placeholders are still present.
const isPlaceholder = (id: string) => /X{4,}/.test(id);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ============================================================
         * ANALYTICS DATA LAYER BOOTSTRAP
         * ============================================================
         * This MUST run before any tag (GTM, GA4, Meta Pixel) loads.
         * It:
         *   1. Initializes window.dataLayer (the GTM data layer)
         *   2. Generates a stable anonymous client_id (localStorage, 2yr)
         *      so events from the same visitor can be stitched together
         *   3. Generates a per-tab session_id (sessionStorage)
         *   4. Pushes Google Consent Mode v2 DEFAULTS (default-deny for
         *      ad_storage — Google's recommended baseline). The
         *      AnalyticsProvider uplifts to "granted" on first mount
         *      because this is a US-only HVAC campaign with no cookie
         *      banner. Replace that uplift with a banner-driven one if
         *      the campaign expands to the EU/CA/UK.
         *   5. Captures first-touch + last-touch attribution from the
         *      landing URL (utm_*, gclid, fbclid, gbclid, referrer) so
         *      every subsequent event — including the very first
         *      page_view — already has full attribution context.
         * ============================================================ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
window.__rasAnalytics = window.__rasAnalytics || { clientId: "", sessionId: "", debug: ${process.env.NODE_ENV !== "production" ? "true" : "false"}, initialized: false };
(function(){
  function genId(){
    try { if (crypto && crypto.randomUUID) return crypto.randomUUID(); } catch(e){}
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,10);
  }
  function readLS(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function writeLS(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  function readSS(k){ try { return sessionStorage.getItem(k); } catch(e){ return null; } }
  function writeSS(k,v){ try { sessionStorage.setItem(k,v); } catch(e){} }
  var cid = readLS("ras_client_id");
  if (!cid) { cid = genId(); writeLS("ras_client_id", cid); }
  var sid = readSS("ras_session_id");
  if (!sid) { sid = genId(); writeSS("ras_session_id", sid); }
  window.__rasAnalytics.clientId = cid;
  window.__rasAnalytics.sessionId = sid;
  window.__rasAnalytics.initialized = true;
})();

/* Google Consent Mode v2 defaults — must be pushed BEFORE GTM/GA4/Meta load */
window.dataLayer.push({
  event: "consent_default",
  consent_state: {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  }
});
if (typeof window.gtag === "function") {
  window.gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "granted", security_storage: "granted"
  });
}

/* First-touch + last-touch attribution capture (runs once on load) */
(function(){
  function clean(o){ var out={}; for (var k in o){ if (o[k]!==undefined && o[k]!==null && o[k]!=="") out[k]=o[k]; } return out; }
  var p = new URLSearchParams(window.location.search);
  var ref = document.referrer || "";
  var fresh = clean({
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
    utm_term: p.get("utm_term"),
    utm_content: p.get("utm_content"),
    gclid: p.get("gclid"),
    fbclid: p.get("fbclid"),
    gbp: p.get("gbp"),
    referrer: ref,
    landing_page: window.location.href,
    captured_at: new Date().toISOString()
  });
  var hasNew = !!(fresh.utm_source || fresh.gclid || fresh.fbclid || fresh.gbp || (fresh.referrer && (function(r){ try { var h=new URL(r).hostname; return h!==window.location.hostname && !h.endsWith("."+window.location.hostname); } catch(e){ return false; } })(fresh.referrer)));
  function readLS(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function writeLS(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  function readSS(k){ try { return sessionStorage.getItem(k); } catch(e){ return null; } }
  function writeSS(k,v){ try { sessionStorage.setItem(k,v); } catch(e){} }
  var ft = null;
  try { ft = JSON.parse(readLS("ras_first_touch") || "null"); } catch(e){}
  if (!ft || hasNew) {
    ft = Object.assign({}, ft || {}, fresh);
    writeLS("ras_first_touch", JSON.stringify(ft));
  }
  var now = Date.now();
  var storedLast = null;
  try { storedLast = JSON.parse(readSS("ras_last_touch") || "null"); } catch(e){}
  var expired = !storedLast || storedLast.expires < now;
  var last;
  if (hasNew || expired || !storedLast) { last = fresh; }
  else { last = storedLast.attribution; }
  writeSS("ras_last_touch", JSON.stringify({ attribution: last, expires: now + 30*60*1000 }));
  window.__rasAttribution = { firstTouch: ft, lastTouch: last };
})();`,
          }}
        />

        {/* Google Tag Manager — the canonical tag manager. When this ID is
            live, GTM loads and manages ALL tags (GA4, Google Ads, Meta Pixel,
            etc.) through its container. The direct GA4 gtag.js fallback below
            is intentionally skipped when GTM is live to avoid double-firing
            GA4 page views. Custom events still flow through window.dataLayer
            which GTM reads via the gtm.js bootstrap.
            Consent Mode v2: the inline bootstrap script above already pushed
            consent defaults + identity BEFORE this gtm.js loads (critical
            ordering — GTM reads the first consent state as the default). */}
        {isPlaceholder(BUSINESS.gtmContainerId) ? null : (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${BUSINESS.gtmContainerId}');`,
            }}
          />
        )}

        {/* GA4 direct fallback — ONLY when GTM is not configured. When GTM is
            live (gtmContainerId is a real ID), this block is skipped and GA4
            is loaded through GTM's container instead. This fallback exists
            so a no-GTM deployment still gets GA4 measurement. */}
        {isPlaceholder(BUSINESS.gtmContainerId) &&
        !isPlaceholder(BUSINESS.ga4MeasurementId) ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${BUSINESS.ga4MeasurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${BUSINESS.ga4MeasurementId}', { send_page_view: true });`,
              }}
            />
          </>
        ) : null}

        {/* Meta Pixel */}
        {isPlaceholder(BUSINESS.metaPixelId) ? null : (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${BUSINESS.metaPixelId}');
fbq('track', 'PageView');`,
            }}
          />
        )}

        {/* Microsoft Clarity — session recordings + heatmaps.
            Loaded unconditionally (advanced consent mode, same as gtag.js) so
            it can send consent-less pings even before the user accepts. The
            follow-up inline script immediately sets the initial consent state
            from localStorage so no session recording happens until the user
            explicitly accepts (EEA/UK/CH compliant). */}
        {BUSINESS.clarityProjectId && !isPlaceholder(BUSINESS.clarityProjectId) ? (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${BUSINESS.clarityProjectId}");`,
              }}
            />
            {/* Set initial Clarity consent from localStorage BEFORE the real
                Clarity tag loads. window.clarity is the queue function at this
                point (created by the snippet above), so this call is queued
                and flushed when clarity.js loads. The ConsentBanner component
                updates this on subsequent user interaction. */}
            <script
              dangerouslySetInnerHTML={{
                __html: `try {
  var sc = JSON.parse(localStorage.getItem('ras_consent_v1') || 'null');
  if (window.clarity && sc && sc.choice === 'granted') {
    window.clarity('consent', 'granted');
  } else if (window.clarity) {
    window.clarity('consent', 'denied');
  }
} catch(e) {}`,
              }}
            />
          </>
        ) : null}

        {/* Structured data — LocalBusiness / HVACBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {/* Structured data — FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {isPlaceholder(BUSINESS.gtmContainerId) ? null : (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${BUSINESS.gtmContainerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {isPlaceholder(BUSINESS.metaPixelId) ? null : (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${BUSINESS.metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        {children}
        <AnalyticsProvider />
        <Toaster />
      </body>
    </html>
  );
}
