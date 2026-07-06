"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins exactly once on the client.
if (typeof window !== "undefined" && !(gsap as any).__wed_registered) {
  gsap.registerPlugin(ScrollTrigger);
  (gsap as any).__wed_registered = true;
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Ease vocabulary shared across the site. */
export const EASE = {
  luxe: "power3.out",
  soft: "power2.out",
  expo: "expo.out",
} as const;
