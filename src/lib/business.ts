/**
 * RAS Heating & Air — centralized business information.
 *
 * IMPORTANT: The phone number and address below are PLACEHOLDERS that match the
 * real RAS Heating & Air business profile shape. Before going live, replace
 * PHONE, PHONE_DISPLAY, PHONE_TEL, EMAIL, ADDRESS_* and HOURS with the values
 * confirmed by RAS Heating & Air (https://www.ras-hvac.com).
 *
 * Keeping everything in one file means a single place to update for the whole
 * landing page + structured data + click-to-call links.
 */

export const BUSINESS = {
  name: "RAS Heating & Air",
  legalName: "RAS Heating & Air",
  website: "https://www.ras-hvac.com",
  tagline: "Reliable HVAC Service in La Habra, CA",

  // --- Contact (placeholders — replace with verified RAS info before launch) ---
  // 562 is the La Habra, CA area code.
  phoneDisplay: "(562) 555-0147",
  phoneTel: "+15625550147",
  email: "service@ras-hvac.com",

  // --- Address (placeholder — replace with verified RAS service address) ---
  // La Habra, CA is the primary local market.
  streetAddress: "1500 W Whittier Blvd",
  addressLocality: "La Habra",
  addressRegion: "CA",
  postalCode: "90631",
  addressCountry: "US",

  // --- Service area ---
  primaryCity: "La Habra, CA",
  serviceRadiusMiles: "2–5 miles",
  serviceAreaCities: [
    "La Habra, CA",
    "La Habra Heights, CA",
    "Brea, CA",
    "Fullerton, CA",
    "Buena Park, CA",
    "Placentia, CA",
    "Whittier, CA",
    "La Mirada, CA",
    "Rowland Heights, CA",
    "Hacienda Heights, CA",
  ],

  // --- Hours (placeholder — replace with verified RAS hours) ---
  // Mon–Sat service hours, emergency service available.
  hours: [
    { days: "Monday – Friday", time: "7:00 AM – 7:00 PM" },
    { days: "Saturday", time: "8:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Emergency Service Only" },
  ],
  openingHoursSchema: [
    "Mo-Fr 07:00-19:00",
    "Sa 08:00-17:00",
  ],

  // --- Trust signals (do NOT fabricate verified data) ---
  yearsExperience: "12+",
  licensed: true,
  insured: true,

  // --- Tracking IDs (placeholders — replace with real container/pixel IDs) ---
  // These are read by the analytics scripts in src/app/layout.tsx.
  ga4MeasurementId: "G-XXXXXXXXXX", // replace with real GA4 Measurement ID
  gtmContainerId: "GTM-XXXXXXX", // replace with real GTM container ID
  metaPixelId: "XXXXXXXXXXXXXXX", // replace with real Meta Pixel ID
  googleAdsConversionId: "AW-XXXXXXXXX",
  googleAdsConversionLabel: "xxxxxxxxxx",

  // --- Social / review profiles (placeholders — replace with verified URLs) ---
  googleBusinessProfileUrl: "https://www.ras-hvac.com",
  facebookUrl: "https://www.ras-hvac.com",
  instagramUrl: "https://www.ras-hvac.com",
} as const;

/**
 * Service catalog used by the Services section, FAQ, and lead form dropdown.
 */
export const SERVICES = [
  {
    slug: "ac-repair",
    title: "AC Repair",
    icon: "Wind",
    short: "Fast, reliable air conditioning repair to get your home cool again — fast.",
    description:
      "When your AC stops cooling, we diagnose the problem and get cold air flowing again with same-day repair service* across La Habra. From refrigerant leaks and bad capacitors to compressor issues, our technicians show up with the parts and know-how to fix it right the first time.",
    cta: "Schedule AC Repair",
    keywords: ["AC repair La Habra", "air conditioning repair", "AC not cooling"],
  },
  {
    slug: "ac-installation-replacement",
    title: "AC Installation & Replacement",
    icon: "Snowflake",
    short: "Energy-efficient AC replacement sized correctly for your home.",
    description:
      "If your system is over 10–15 years old or needs frequent repairs, a new high-efficiency AC can lower your bills and improve comfort. We help you choose the right unit, install it to manufacturer specs, and back our workmanship.",
    cta: "Get AC Replacement Quote",
    keywords: ["AC installation La Habra", "AC replacement", "central air install"],
  },
  {
    slug: "heating-furnace-repair",
    title: "Heating & Furnace Repair",
    icon: "Flame",
    short: "Keep your home warm with fast, reliable heating and furnace repair.",
    description:
      "Southern California winters still get cold. We repair gas furnaces, electric heaters, and heat pumps so your home stays comfortable. If your heater is short-cycling, blowing cold air, or making noise, we'll find and fix the problem.",
    cta: "Schedule Heating Repair",
    keywords: ["heating repair La Habra", "furnace repair La Habra", "heater not working"],
  },
  {
    slug: "hvac-installation",
    title: "HVAC Installation",
    icon: "Wrench",
    short: "Complete HVAC system installation for new builds and replacements.",
    description:
      "Full heating and cooling system installation for La Habra homeowners — properly sized, correctly installed, and balanced for even comfort throughout your home. We handle the equipment, ductwork, thermostat, and startup.",
    cta: "Request HVAC Install Quote",
    keywords: ["HVAC installation La Habra", "new HVAC system", "heating and cooling install"],
  },
  {
    slug: "hvac-maintenance",
    title: "HVAC Maintenance",
    icon: "CalendarClock",
    short: "Seasonal tune-ups that keep your system efficient and prevent breakdowns.",
    description:
      "Routine maintenance extends equipment life, keeps energy bills down, and catches small problems before they become expensive repairs. Our maintenance visit includes cleaning, inspection, and system performance testing.",
    cta: "Book Maintenance",
    keywords: ["HVAC maintenance La Habra", "AC tune-up", "furnace tune-up"],
  },
  {
    slug: "mini-split-systems",
    title: "Mini-Split Systems",
    icon: "AirVent",
    short: "Ductless mini-split installation for room-by-room comfort control.",
    description:
      "Ductless mini-splits are a quiet, efficient solution for additions, converted garages, or rooms that never get comfortable. We size, install, and service single and multi-zone mini-split systems from trusted brands.",
    cta: "Get Mini-Split Quote",
    keywords: ["mini split installation La Habra", "ductless AC", "ductless mini split"],
  },
  {
    slug: "indoor-air-quality",
    title: "Indoor Air Quality",
    icon: "Leaf",
    short: "Clean air solutions for healthier indoor comfort.",
    description:
      "Better air filtration, UV treatment, and humidity control can reduce dust, allergens, and odors in your home. We evaluate your current system and recommend practical upgrades that fit your home and budget.",
    cta: "Improve My Air Quality",
    keywords: ["indoor air quality La Habra", "air filtration", "UV air purifier"],
  },
  {
    slug: "emergency-hvac-service",
    title: "Emergency HVAC Service",
    icon: "Siren",
    short: "Fast response when your heating or cooling fails unexpectedly.",
    description:
      "AC out on the hottest day of the year? Furnace down on a cold night? We prioritize emergency calls across La Habra and surrounding neighborhoods to get your comfort restored as quickly as possible.*",
    cta: "Call For Emergency Service",
    keywords: ["emergency HVAC La Habra", "emergency AC repair", "24/7 HVAC service"],
  },
] as const;

export const SERVICE_TITLES = SERVICES.map((s) => s.title);
