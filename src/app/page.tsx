import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { LeadCaptureSection } from "@/components/landing/LeadCaptureSection";
import { Services } from "@/components/landing/Services";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { ServiceArea } from "@/components/landing/ServiceArea";
import { OfferSection } from "@/components/landing/OfferSection";
import { ProjectShowcase } from "@/components/landing/ProjectShowcase";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { StickyMobileCta } from "@/components/landing/StickyMobileCta";

/**
 * RAS Heating & Air — La Habra HVAC Lead Generation Landing Page.
 *
 * A single, conversion-focused landing page built to capture qualified local
 * HVAC leads (calls + free-estimate form submissions) from La Habra, CA and
 * an approximately 2–5 mile service radius. The page is server-rendered for SEO
 * and performance; only the interactive bits (header, form, CTAs, sticky bar)
 * ship client-side JavaScript.
 *
 * Section order follows the campaign brief:
 *   1. Hero
 *   2. Local trust / social proof
 *   3. Lead capture (form)
 *   4. HVAC services
 *   5. Why choose RAS
 *   6. Local service area
 *   7. Offer (free estimate)
 *   8. Project showcase
 *   9. FAQ
 *  10. Final CTA
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Hero />
        <SocialProof />
        <LeadCaptureSection />
        <Services />
        <WhyChooseUs />
        <ServiceArea />
        <OfferSection />
        <ProjectShowcase />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <StickyMobileCta />
    </div>
  );
}
