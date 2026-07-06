"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { story, storyEpilogue, storyTeaser, images } from "@/lib/content";
import { useReducedMotion, useIsDesktop } from "@/lib/hooks";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { PalmLeaf } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

/** Portrait photo frame — fits vertical images without cropping their subject. */
function ChapterPhoto({ i }: { i: number }) {
  const ch = story[i];
  return (
    <div className="chapter-photo relative mx-auto aspect-[4/5] w-full max-w-[27rem] overflow-hidden rounded-3xl border border-gold/25 shadow-xl">
      <PhotoPlaceholder
        label={`${ch.year}`}
        index={i}
        src={images.story[ch.year]}
        alt={`${ch.year} — ${ch.title}`}
      />
    </div>
  );
}

function ChapterText({ i }: { i: number }) {
  const ch = story[i];
  return (
    <div className="flex flex-col gap-4">
      <span className="script-accent text-4xl text-gold sm:text-5xl">{ch.year}</span>
      <h3 className="font-serif text-3xl text-palm sm:text-4xl">{ch.title}</h3>
      {ch.place && (
        <span className="font-sans text-[0.72rem] uppercase tracking-wide2 text-terracotta">
          {ch.place}
        </span>
      )}
      <div className="mt-1 space-y-3.5">
        {ch.paras.map((p, j) => (
          <p key={j} className="font-sans text-base leading-relaxed text-ink-soft sm:text-[1.05rem]">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

/** One full-screen chapter panel for the mobile horizontal scroll. */
function MobilePanel({ i }: { i: number }) {
  const ch = story[i];
  return (
    <div className="flex h-full w-screen shrink-0 flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="relative aspect-[4/5] h-[34svh] max-h-[22rem] overflow-hidden rounded-3xl border border-gold/25 shadow-xl">
        <PhotoPlaceholder
          label={`${ch.year}`}
          index={i}
          src={images.story[ch.year]}
          alt={`${ch.year} — ${ch.title}`}
        />
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <span className="script-accent text-2xl text-gold">{ch.year}</span>
        <h3 className="font-serif text-xl text-palm">{ch.title}</h3>
        {ch.place && (
          <span className="font-sans text-[0.68rem] uppercase tracking-wide2 text-terracotta">
            {ch.place}
          </span>
        )}
        <div className="mt-1 space-y-2">
          {ch.paras.map((p, j) => (
            <p key={j} className="font-sans text-[0.85rem] leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Reduced-motion fallback: a simple vertical stacked list. */
function StaticStory() {
  return (
    <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-20 px-2">
      {story.map((ch, i) => (
        <div key={ch.year} className="grid items-center gap-8 sm:grid-cols-2">
          <div className={cn(i % 2 ? "sm:order-2" : "")}>
            <ChapterPhoto i={i} />
          </div>
          <ChapterText i={i} />
        </div>
      ))}
    </div>
  );
}

/** Progress dots shared by both layouts. */
function Dots({ active, className }: { active: number; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2.5", className)}>
      {story.map((ch, i) => (
        <span
          key={ch.year}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            active === i ? "w-6 bg-gold" : "w-1.5 bg-gold/30"
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const scrolly = useRef<HTMLDivElement>(null); // desktop vertical track
  const pinRef = useRef<HTMLDivElement>(null); // mobile horizontal pin
  const rowRef = useRef<HTMLDivElement>(null); // mobile horizontal row
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const N = story.length;

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Header + teaser rise in.
      gsap.from(".story-head > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      if (isDesktop) {
        // Desktop: sticky panel, cross-fade chapters by scroll progress.
        if (scrolly.current) {
          ScrollTrigger.create({
            trigger: scrolly.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              const idx = Math.min(N - 1, Math.floor(self.progress * N));
              setActive((prev) => (prev === idx ? prev : idx));
            },
          });
        }
      } else {
        // Mobile: pin the section and slide chapters horizontally.
        const row = rowRef.current;
        const pin = pinRef.current;
        if (row && pin) {
          const amount = () => row.scrollWidth - window.innerWidth;
          const tween = gsap.to(row, { x: () => -amount(), ease: "none" });
          ScrollTrigger.create({
            trigger: pin,
            start: "top top",
            // shorter scroll distance = chapters advance faster per swipe
            end: () => "+=" + amount() * 0.6,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            animation: tween,
            onUpdate: (self) => {
              const idx = Math.min(N - 1, Math.round(self.progress * (N - 1)));
              setActive((prev) => (prev === idx ? prev : idx));
            },
          });
        }
      }
    }, root);
    return () => ctx.revert();
  }, [reduced, isDesktop, N]);

  return (
    <section
      id="story"
      ref={root}
      className="relative overflow-x-clip bg-ivory-warm"
    >
      <PalmLeaf className="pointer-events-none absolute right-0 top-16 w-40 rotate-[30deg] text-olive/10" />

      <div className="story-head mx-auto max-w-editorial px-6 pt-24 text-center sm:pt-28">
        <span className="eyebrow">Our Story</span>
        <h2 className="mt-4 font-sans text-2xl font-light uppercase tracking-[0.16em] text-ink sm:text-4xl sm:tracking-[0.2em]">
          <SplitWords text="Two worlds, one love story" />
        </h2>
        <p className="script-accent mx-auto mt-4 max-w-lg text-2xl text-gold sm:text-3xl">
          {storyTeaser}
        </p>
      </div>

      {reduced ? (
        <StaticStory />
      ) : isDesktop ? (
        // Desktop — sticky vertical track with cross-fading chapters.
        <div ref={scrolly} className="relative mt-10 px-6" style={{ height: `${N * 70}vh` }}>
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 sm:grid-cols-2 sm:gap-16">
              {/* image stack — only the active chapter is visible */}
              <div className="relative aspect-[4/5] w-full max-w-[27rem] justify-self-center sm:justify-self-end">
                {story.map((ch, i) => (
                  <div
                    key={ch.year}
                    className="absolute inset-0 transition-opacity duration-700 ease-out"
                    style={{ opacity: active === i ? 1 : 0, zIndex: active === i ? 2 : 1 }}
                  >
                    <ChapterPhoto i={i} />
                  </div>
                ))}
              </div>

              {/* text stack */}
              <div className="relative min-h-[18rem]">
                {story.map((ch, i) => (
                  <div
                    key={ch.year}
                    className="absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: `translateY(${active === i ? 0 : i < active ? -14 : 14}px)`,
                      pointerEvents: active === i ? "auto" : "none",
                    }}
                  >
                    <ChapterText i={i} />
                  </div>
                ))}
              </div>
            </div>

            <Dots active={active} className="mt-10" />
          </div>
        </div>
      ) : (
        // Mobile — full-bleed pinned track scrolled horizontally.
        <div ref={pinRef} className="relative mt-8 h-[100svh] w-full overflow-hidden">
          <div ref={rowRef} className="flex h-full w-max">
            {story.map((ch, i) => (
              <MobilePanel key={ch.year} i={i} />
            ))}
          </div>
          <Dots active={active} className="absolute bottom-6 left-1/2 -translate-x-1/2" />
        </div>
      )}

      {/* epilogue */}
      <Reveal className="mx-auto mt-20 max-w-3xl px-6 pb-24" y={40}>
        <div className="glass rounded-3xl px-8 py-12 text-center sm:px-14">
          <span className="script-accent text-3xl text-gold sm:text-4xl">
            {storyEpilogue.title}
          </span>
          <div className="mt-6 space-y-4">
            {storyEpilogue.paras.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "font-sans leading-relaxed text-ink-soft",
                  i === 0 ? "font-serif text-xl italic text-palm" : "text-[0.92rem]"
                )}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
