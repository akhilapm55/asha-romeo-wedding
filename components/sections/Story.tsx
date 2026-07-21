"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { story, storyEpilogue, storyTeaser, images } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import SectionHeading from "@/components/ui/SectionHeading";
import { PalmLeaf } from "@/components/ui/Decor";

/** A node on the timeline spine. */
function Node() {
  return (
    <span className="relative z-10 mt-2.5 h-3 w-3 shrink-0 rounded-full border-2 border-gold bg-ivory-warm" />
  );
}

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string): Element[] => self.selector!(s);
      q(".story-chapter").forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="story"
      ref={root}
      className="section-shell relative overflow-x-clip bg-ivory-warm py-24 sm:py-32"
    >

      <PalmLeaf className="pointer-events-none absolute right-0 top-20 w-40 rotate-[30deg] text-olive/10" />

      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Our Story" title="Two worlds, one love story" />

        <p className="script-accent mx-auto mt-6 max-w-lg text-center text-2xl leading-[1.35] text-gold sm:text-3xl">
          {storyTeaser}
        </p>

        {/* timeline */}
        <div className="relative mt-16 flex flex-col gap-14 sm:mt-20 sm:gap-20">
          {/* continuous dotted spine */}
          <span
            aria-hidden
            className="absolute bottom-3 left-[5px] top-4 w-[2px] bg-[repeating-linear-gradient(to_bottom,rgba(191,159,99,0.5)_0_5px,transparent_5px_12px)]"
          />

          {story.map((ch) => {
            const photo = images.story[ch.year]; // undefined → text only, no box
            return (
              <article
                key={ch.year}
                className="story-chapter relative grid grid-cols-[12px_1fr] gap-x-5 sm:gap-x-8"
              >
                <Node />
                <div>
                  <span className="script-accent text-3xl text-gold sm:text-4xl">
                    {ch.year}
                  </span>
                  <h3 className="mt-1.5 font-serif text-2xl text-palm sm:text-3xl">
                    {ch.title}
                  </h3>
                  {ch.place && (
                    <span className="mt-1.5 block font-sans text-[0.7rem] uppercase tracking-wide2 text-terracotta">
                      {ch.place}
                    </span>
                  )}

                  {photo ? (
                    <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_15rem] sm:items-start">
                      <div className="space-y-3">
                        {ch.paras.map((p, j) => (
                          <p
                            key={j}
                            className="font-sans text-[0.95rem] leading-relaxed text-ink-soft"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                      <div className="relative aspect-[4/5] w-full max-w-[15rem] overflow-hidden rounded-2xl border border-gold/25 shadow-lg">
                        <PhotoPlaceholder
                          label={ch.year}
                          index={0}
                          src={photo}
                          alt={`${ch.year} — ${ch.title}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {ch.paras.map((p, j) => (
                        <p
                          key={j}
                          className="font-sans text-[0.95rem] leading-relaxed text-ink-soft"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {/* closing chapter — folds the old "Building a life together" block in */}
          <article className="story-chapter relative grid grid-cols-[12px_1fr] gap-x-5 sm:gap-x-8">
            <Node />
            <div>
              <span className="script-accent text-3xl text-gold sm:text-4xl">
                {storyEpilogue.title}
              </span>
              <div className="mt-4 space-y-3">
                {storyEpilogue.paras.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "font-serif text-lg italic leading-relaxed text-palm sm:text-xl"
                        : "font-sans text-[0.95rem] leading-relaxed text-ink-soft"
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
