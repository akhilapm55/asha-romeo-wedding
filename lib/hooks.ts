"use client";

import { useEffect, useMemo, useState } from "react";

/** True when the user has requested reduced motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** True on pointer:fine, wide viewports — gates custom cursor & heavy motion. */
export function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

/** Live countdown to an ISO target. Renders 0s during SSR to avoid mismatch. */
export function useCountdown(targetIso: string): TimeLeft {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? 0 : Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: now !== null && diff === 0,
  };
}

/** Tracks whether an element is in view (once) via IntersectionObserver. */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
  const [ref, setRef] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, inView, threshold]);
  return [setRef, inView] as const;
}
