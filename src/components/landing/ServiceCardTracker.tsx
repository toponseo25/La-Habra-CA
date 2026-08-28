"use client";

import { useEffect, useRef } from "react";
import { trackServiceCardView } from "@/lib/analytics";

/**
 * Wraps a service card and fires a `service_card_view` event when the card
 * first scrolls into view — this lets us measure which services visitors
 * actually see (vs. just which CTAs they click), which is the standard
 * "view_item" funnel stage in GA4.
 *
 * Uses IntersectionObserver (no scroll listeners) so it's cheap. Each card
 * fires exactly once per page load.
 */
export function ServiceCardTracker({
  slug,
  title,
  index,
  children,
}: {
  slug: string;
  title: string;
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            trackServiceCardView(slug, title, index);
            observer.disconnect();
          }
        }
      },
      // Fire when at least 60% of the card is visible — avoids counting
      // cards the user scrolled past without actually seeing.
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug, title, index]);

  return <div ref={ref}>{children}</div>;
}
