"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Lenis smooth scroll, driven off GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled entirely under prefers-reduced-motion (native scrolling instead).
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Allow anchor links / buttons to request a scroll.
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { target: string | number; opts?: object }
        | undefined;
      if (detail) lenis.scrollTo(detail.target as any, detail.opts);
    };
    window.addEventListener("lenis:scroll-to", handler);

    return () => {
      window.removeEventListener("lenis:scroll-to", handler);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}

/** Fire from anywhere to smooth-scroll to a selector or offset. */
export function scrollToTarget(target: string | number, opts?: object) {
  window.dispatchEvent(
    new CustomEvent("lenis:scroll-to", { detail: { target, opts } })
  );
}
