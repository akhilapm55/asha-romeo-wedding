"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { couple, eventMeta, COUNTDOWN_TARGET, images } from "@/lib/content";
import { useCountdown, useReducedMotion } from "@/lib/hooks";

import { PalmLeaf } from "@/components/ui/Decor";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { scrollToTarget } from "@/components/providers/SmoothScroll";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-3xl tabular-nums text-palm sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-sans text-[0.55rem] uppercase tracking-luxe text-ink-faint sm:text-[0.62rem]">
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const t = useCountdown(COUNTDOWN_TARGET);

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string) => self.selector!(s);
      // Layered parallax on scroll — each depth layer at its own speed.
      gsap.to(q(".pl-sky"), {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".pl-banner"), {
        yPercent: 12,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".pl-content"), {
        yPercent: -12,
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "20% top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="hero"
      className="grain relative flex min-h-[82svh] w-full items-center justify-center overflow-hidden py-16 sm:min-h-[100svh] sm:py-0"
    >
      {/* sky wash — ends on ivory so the section bottom matches the page bg */}
      <div className="pl-sky absolute inset-0 z-0 bg-gradient-to-b from-ivory via-ivory-warm to-ivory" />

      {/* couple banner — masked so the photo itself dissolves at the bottom */}
      <div
        className="pl-banner absolute inset-0 z-[1] opacity-[0.55] will-change-transform"
        aria-hidden
        style={{
          maskImage:
            "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.45) 72%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.45) 72%, transparent 95%)",
        }}
      >
        <PhotoPlaceholder
          index={2}
          label=""
          src={images.heroCouple}
          alt=""
          imgClassName="object-top"
        />
      </div>

      {/* light scrim at the top + a soft ivory halo behind the text for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-ivory/55 via-ivory/20 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory/55 blur-[80px]" />
      <div className="absolute left-1/2 top-[16%] z-[2] h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-[90px]" />

      {/* smoky bottom — the mask above already dissolves the photo; this just
          softens the last stretch so it melts into the next section's ivory */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2/5 bg-gradient-to-b from-transparent via-ivory/45 to-ivory" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-24 bg-ivory/50 blur-2xl" />

      {/* palms — one left, one right */}
      <div className="absolute inset-0 z-[3]" aria-hidden>
        <PalmLeaf className="absolute -left-10 bottom-0 w-32 rotate-[8deg] text-palm/25 sm:-left-16 sm:w-80" />
        <PalmLeaf className="absolute -right-10 bottom-4 w-32 -rotate-[10deg] text-palm-dark/20 sm:-right-16 sm:w-80" />
      </div>

      {/* content */}
      <div className="pl-content relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--font-hero)" }}
          className="text-6xl leading-[1.05] text-ink sm:text-8xl"
        >
          {couple.bride.first} <span className="text-gold">&amp;</span>{" "}
          {couple.groom.first}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-md font-sans text-sm tracking-wide text-ink-soft sm:text-base"
        >
          {eventMeta.dateLine}
          <span className="mx-2 text-gold">·</span>
          {eventMeta.location}
        </motion.p>

        {/* countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex items-end gap-5 sm:gap-8"
        >
          <CountdownUnit value={t.days} label="Days" />
          <span className="pb-6 text-gold/50">·</span>
          <CountdownUnit value={t.hours} label="Hrs" />
          <span className="pb-6 text-gold/50">·</span>
          <CountdownUnit value={t.minutes} label="Min" />
          <span className="pb-6 text-gold/50">·</span>
          <CountdownUnit value={t.seconds} label="Sec" />
        </motion.div>
      </div>

      {/* scroll cue — line only, no label */}
      <motion.button
        onClick={() => scrollToTarget("#welcome")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
        aria-label="Scroll to begin"
      >
        <span className="h-10 w-[1px] animate-[cue_2s_ease-in-out_infinite] bg-gradient-to-b from-gold to-transparent" />
        <style jsx>{`
          @keyframes cue {
            0%,
            100% {
              transform: scaleY(0.4);
              opacity: 0.4;
            }
            50% {
              transform: scaleY(1);
              opacity: 1;
            }
          }
        `}</style>
      </motion.button>
    </section>
  );
}
