"use client";

import { trackClickToCall, trackCtaClick } from "@/lib/analytics";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";

// Re-export so existing imports keep working, but server components should
// import ctaButtonClass directly from "@/components/landing/ctaStyles".
export { ctaButtonClass } from "@/components/landing/ctaStyles";

/**
 * Trackable CTA link used everywhere on the landing page.
 *
 * Supports three modes:
 *  - "call"  -> renders a tel: link and fires the click_to_call analytics event
 *  - "scroll" -> renders an in-page anchor (#lead-form) and fires cta_click
 *  - "link"  -> renders an external link (e.g. to ras-hvac.com) and fires cta_click
 *
 * Keeping all CTA rendering in one place means consistent analytics + a11y +
 * styling across the whole page. The actual visual style is controlled via
 * `className` so this stays a pure behavior wrapper.
 */
type CtaLinkProps = {
  mode: "call" | "scroll" | "link";
  href?: string;
  label: string;
  trackingLabel: string;
  trackingLocation: string;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  external?: boolean;
};

export function CtaLink({
  mode,
  href,
  label,
  trackingLabel,
  trackingLocation,
  className,
  children,
  ariaLabel,
  external,
}: CtaLinkProps) {
  const resolvedHref =
    mode === "call" ? `tel:${BUSINESS.phoneTel}` : href ?? "#lead-form";

  const handleClick = () => {
    if (mode === "call") {
      trackClickToCall(trackingLocation, BUSINESS.phoneDisplay);
    } else {
      trackCtaClick(
        trackingLabel,
        trackingLocation,
        mode === "scroll" ? "scroll" : mode === "link" ? "external" : "phone",
      );
    }
  };

  if (mode === "link" && external) {
    return (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? label}
        className={className}
        onClick={handleClick}
      >
        {children ?? label}
      </a>
    );
  }

  return (
    <a
      href={resolvedHref}
      aria-label={ariaLabel ?? label}
      className={cn(className)}
      onClick={handleClick}
    >
      {children ?? label}
    </a>
  );
}

