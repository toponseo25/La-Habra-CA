"use client";

import { useEffect, useState } from "react";

export type SectionId =
  | "top"
  | "trust"
  | "estimate"
  | "services"
  | "why-ras"
  | "service-area"
  | "offer"
  | "projects"
  | "faq"
  | "final-cta";

/**
 * Scroll spy — tracks which section of the page is currently in view and
 * returns its id. Used by the Header to highlight the active nav link.
 *
 * Uses IntersectionObserver (no scroll listeners) with a small negative root
 * margin so the "active" section flips when its heading crosses the sticky
 * header boundary, not when it reaches the very top of the viewport.
 *
 * Returns "top" (the hero) as the default until the user scrolls past it.
 */
export function useScrollSpy(sectionIds: SectionId[]): SectionId {
  const [activeId, setActiveId] = useState<SectionId>("top");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    // The sticky header is h-16 (4rem). We use a 20% top margin so the active
    // section flips when its heading is ~80px below the header (feels natural).
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort by document order so the topmost intersecting section wins
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("id") as SectionId | null;
          if (id) setActiveId(id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px", // active when heading is in the top 20%
        threshold: 0,
      },
    );

    // Observe each section element. Skip any that don't exist on the page.
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
