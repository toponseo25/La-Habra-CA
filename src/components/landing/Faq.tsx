import { HelpCircle, Phone, MessageCircleQuestion } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaLink } from "@/components/landing/CtaLink";
import { BUSINESS } from "@/lib/business";

const FAQS = [
  {
    q: "How much does HVAC repair cost in La Habra?",
    a: "HVAC repair costs in La Habra depend on the part, system type, and warranty status. A diagnostic service call with RAS Heating & Air includes a full system assessment and upfront, no-surprise pricing before any work begins — so you approve the cost before we start. We always quote the repair vs. replacement trade-off so you can make the best call for your home.",
  },
  {
    q: "How quickly can an HVAC technician come out?",
    a: "RAS Heating & Air offers same-day service* across La Habra and surrounding neighborhoods for most repair requests, and we prioritize emergency no-cooling and no-heat calls. The fastest way to get on the schedule is to call us directly or submit a free estimate request on this page.",
  },
  {
    q: "When should I replace my AC system?",
    a: "Most central AC systems last about 10–15 years. We typically recommend replacement when your system is over 10 years old, needs frequent repairs, uses R-22 refrigerant, or your summer cooling bills keep climbing. A professional assessment can confirm whether a repair or replacement makes the most financial sense for your home.",
  },
  {
    q: "How often should my HVAC system be serviced?",
    a: "We recommend professional maintenance twice a year — once in spring for cooling and once in fall for heating. Routine tune-ups keep your system efficient, extend equipment life, and catch small problems before they become expensive repairs.",
  },
  {
    q: "Do you provide emergency HVAC service?",
    a: "Yes. RAS Heating & Air prioritizes emergency HVAC calls across La Habra and nearby communities — including no-cooling emergencies on hot days and no-heat situations on cold nights. Call us directly for the fastest response.",
  },
  {
    q: "Do you install mini-split systems?",
    a: "Yes. We size, install, and service single-zone and multi-zone ductless mini-split systems in La Habra homes. Mini-splits are a quiet, efficient option for additions, converted garages, or rooms that never get comfortable with your central system.",
  },
  {
    q: "How do I know if my AC needs repair or replacement?",
    a: "Common signs your AC needs attention: warm air from the vents, weak airflow, strange noises or odors, short cycling, higher-than-normal bills, or frequent repairs. If your system is over 10 years old and the repair cost is significant, a replacement is often the better long-term value — we'll lay out both options clearly.",
  },
  {
    q: "What areas around La Habra do you service?",
    a: `Our primary service area is La Habra, CA and an approximately 2–5 mile radius — including La Habra Heights, Brea, Fullerton, Buena Park, Placentia, Whittier, La Mirada, Rowland Heights, and Hacienda Heights. If you're nearby, reach out and we'll confirm serviceability for your address.`,
  },
];

/**
 * FAQ section (brief section #9). SEO + conversion focused. The Q&A content
 * is mirrored in JSON-LD structured data in layout.tsx so Google can surface
 * rich FAQ results.
 */
export function Faq() {
  return (
    <section
      id="faq"
      className="bg-white py-16 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
            <MessageCircleQuestion className="h-3.5 w-3.5" aria-hidden />
            Questions? We've Got Answers
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            La Habra HVAC Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Straight answers to the most common HVAC questions we hear from La
            Habra homeowners.
          </p>
        </div>

        <div className="mt-10 rounded-2xl ring-1 ring-slate-200 bg-slate-50 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-b border-slate-200 last:border-0"
              >
                <AccordionTrigger className="px-5 sm:px-6 py-4 text-left text-base font-bold text-slate-900 hover:bg-white hover:no-underline">
                  <span className="flex items-start gap-3">
                    <HelpCircle
                      className="h-5 w-5 mt-0.5 text-orange-500 shrink-0"
                      aria-hidden
                    />
                    <span>{item.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 sm:px-6 pb-5 pt-0 text-slate-600 leading-relaxed">
                  <span className="pl-8 block">{item.a}</span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className="mt-10 rounded-2xl bg-slate-900 p-6 sm:p-8 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-bold">
            Still have an HVAC question?
          </h3>
          <p className="mt-2 text-slate-300">
            Give us a call — we're happy to help La Habra homeowners figure out
            their next step.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <CtaLink
              mode="call"
              label={`Call ${BUSINESS.phoneDisplay}`}
              trackingLabel={`Call ${BUSINESS.phoneDisplay}`}
              trackingLocation="faq"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all active:scale-95"
            />
            <CtaLink
              mode="scroll"
              href="#lead-form"
              label="Request a Free Estimate"
              trackingLabel="Request a Free Estimate"
              trackingLocation="faq"
              className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/30 px-6 py-3 text-sm font-bold text-white transition-all active:scale-95"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
