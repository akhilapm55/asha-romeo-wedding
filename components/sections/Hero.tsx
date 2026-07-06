"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { couple, eventMeta, COUNTDOWN_TARGET, images } from "@/lib/content";
import { useCountdown, useReducedMotion } from "@/lib/hooks";
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
      // Slow ken-burns + gentle parallax drift on the banner as you scroll.
      gsap.to(q(".pl-banner"), {
        yPercent: 16,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      // Content lifts, softens and fades as the hero leaves.
      gsap.to(q(".pl-content"), {
        yPercent: -14,
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "10% top", end: "70% top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-[100svh] w-full items-end justify-center overflow-hidden"
    >
      {/* full-bleed couple banner (drop /images/couple/couple-hero.jpg) */}
      <div className="pl-banner absolute inset-0 z-0 will-change-transform">
        <PhotoPlaceholder
          label="Couple photo"
          index={2}
          src={images.heroCouple}
          alt={`${couple.bride.first} & ${couple.groom.first}`}
          className="rounded-none"
        />
      </div>

      {/* smoky bottom fade — keeps the top of the photo clear, then dissolves the
          banner into the ivory of the next section (and backs the text below) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-b from-transparent via-ivory/45 to-ivory" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/5 bg-ivory/30 blur-2xl" />

      {/* content — sits within the smoke, so it stays legible over any photo */}
      <div className="pl-content relative z-10 mx-auto mb-14 flex max-w-4xl flex-col items-center px-6 pb-6 text-center sm:mb-20">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow"
        >
          Together with their families
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-sans text-4xl font-light uppercase leading-tight tracking-[0.16em] text-ink drop-shadow-sm sm:text-7xl sm:tracking-[0.2em]"
        >
          {couple.bride.first} <span className="text-gold">+</span>{" "}
          {couple.groom.first}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex items-end gap-5 sm:gap-8"
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

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToTarget("#welcome")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-faint"
        aria-label="Scroll to begin"
      >
        <span className="font-sans text-[0.58rem] uppercase tracking-luxe">Their story</span>
        <span className="h-9 w-[1px] animate-[cue_2s_ease-in-out_infinite] bg-gradient-to-b from-gold to-transparent" />
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
