"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { story, storyEpilogue, storyTeaser, images } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { Reveal, SplitWords } from "@/components/ui/Reveal";
import { PalmLeaf } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

/** Portrait photo frame — fits vertical images without cropping their subject. */
function ChapterPhoto({ i }: { i: number }) {
  const ch = story[i];
  return (
    <div className="chapter-photo relative mx-auto aspect-[4/5] w-full max-w-[19rem] overflow-hidden rounded-3xl border border-gold/25 shadow-xl sm:max-w-[27rem]">
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

/** Reduced-motion / no-JS fallback: a simple stacked list. */
function StaticStory() {
  return (
    <div className="mx-auto mt-16 flex max-w-4xl flex-col gap-20">
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

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const scrolly = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const N = story.length;

  useLayoutEffect(() => {
    if (reduced || !scrolly.current) return;
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
      // Drive the active chapter from scroll progress through the tall track.
      ScrollTrigger.create({
        trigger: scrolly.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(N - 1, Math.floor(self.progress * N));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced, N]);

  return (
    <section
      id="story"
      ref={root}
      className="section-shell relative overflow-x-clip bg-ivory-warm py-28 sm:py-32"
    >
      <PalmLeaf className="pointer-events-none absolute right-0 top-24 w-40 rotate-[30deg] text-olive/10" />

      <div className="story-head mx-auto max-w-editorial text-center">
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
      ) : (
        // Tall track: each chapter gets ~one viewport of scroll. The inner panel
        // is sticky, so image + text stay pinned and swap as you scroll through.
        <div ref={scrolly} className="relative mt-10" style={{ height: `${N * 100}vh` }}>
          <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-2 sm:grid-cols-2 sm:gap-16">
              {/* image stack — only the active chapter is visible */}
              <div className="relative aspect-[4/5] w-full max-w-[19rem] justify-self-center sm:max-w-[27rem] sm:justify-self-end">
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

            {/* progress dots */}
            <div className="mt-10 flex items-center justify-center gap-2.5">
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
          </div>
        </div>
      )}

      {/* epilogue */}
      <Reveal className="mx-auto mt-20 max-w-3xl" y={40}>
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
