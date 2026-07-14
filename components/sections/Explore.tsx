"use client";

import { useLayoutEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { WatercolorBlob } from "@/components/ui/Decor";
import { useReducedMotion, useIsDesktop } from "@/lib/hooks";
import { gsap } from "@/lib/gsap";
import { exploreKerala, images, type Place } from "@/lib/content";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Offset masonry layout, tuned per index for a Pinterest-y editorial rhythm.
   `col` places the card in one of two desktop columns (for parallax offset),
   `aspect` mixes tall / standard portraits, `pull` nudges alternate cards down
   so the two columns never line up flatly. Mobile collapses to one clean column.
--------------------------------------------------------------------------- */
type Layout = { col: 0 | 1; aspect: string; pull: string };

const LAYOUTS: Layout[] = [
  { col: 0, aspect: "aspect-square", pull: "" },
  { col: 1, aspect: "aspect-[4/5]", pull: "lg:mt-12" },
  { col: 0, aspect: "aspect-[4/5]", pull: "lg:mt-4" },
  { col: 1, aspect: "aspect-square", pull: "lg:mt-2" },
  { col: 0, aspect: "aspect-square", pull: "lg:mt-4" },
];

function PlaceCard({ place, i }: { place: Place; i: number }) {
  const layout = LAYOUTS[i % LAYOUTS.length];
  // Alternate the rest tilt so cards lean into and away from the scroll.
  const dir = i % 2 === 0 ? 1 : -1;

  return (
    <article
      className={cn(
        "explore-card group relative",
        layout.pull
      )}
      data-dir={dir}
      style={{ willChange: "transform" }}
    >
      <div className="explore-frame relative overflow-hidden rounded-[1.75rem] border border-gold/15 bg-ivory/40 shadow-[0_30px_70px_-40px_rgba(59,82,65,0.5)]">
        {/* Image well — inner layer is oversized so the scrub zoom never
            reveals an edge (matches Venue/Story parallax pattern). */}
        <div className={cn("relative w-full overflow-hidden", layout.aspect)}>
          <div className="explore-photo absolute inset-0 will-change-transform">
            <PhotoPlaceholder index={i} label={place.name} className="scale-110" src={images.explore[place.name]} alt={place.name} />
          </div>

          {/* legibility wash + kind chip */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-palm/45 via-palm/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-ivory/30 bg-ink/35 px-3 py-1 font-sans text-[0.55rem] uppercase tracking-luxe text-ivory backdrop-blur-sm">
            {place.kind}
          </span>
        </div>

        {/* Caption block */}
        <div className="relative px-6 pb-7 pt-5 sm:px-7">
          <h3 className="font-serif text-2xl leading-tight text-palm sm:text-[1.7rem]">
            {place.name}
          </h3>
          <span className="mt-3 block h-px w-10 bg-gold/50 transition-all duration-500 group-hover:w-16" />
          <p className="mt-4 font-sans text-[0.9rem] leading-relaxed text-ink-soft">
            {place.blurb}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Explore() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string): Element[] => self.selector!(s);

      q(".explore-card").forEach((el) => {
        const card = el as HTMLElement;
        const dir = Number(card.dataset.dir || 1);

        // Enter reveal: rise + fade with a gentle stagger by position.
        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        // SIGNATURE MOTION — cards slightly rotate as they pass through the
        // viewport, alternating direction (~ -4deg → +4deg), scrubbed.
        gsap.fromTo(
          card,
          { rotateZ: -4 * dir },
          {
            rotateZ: 4 * dir,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );

        // Images slowly zoom (1.2 → 1) on scroll scrub for an alive, editorial feel.
        const photo = card.querySelector(".explore-photo");
        if (photo)
          gsap.fromTo(
            photo,
            { scale: 1.2 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                end: "bottom 35%",
                scrub: true,
              },
            }
          );
      });

      // Desktop only: subtle per-column parallax offset for depth.
      if (isDesktop) {
        q(".explore-col").forEach((colEl, idx) => {
          gsap.fromTo(
            colEl,
            { yPercent: idx % 2 === 0 ? 0 : -3 },
            {
              yPercent: idx % 2 === 0 ? -6 : 4,
              ease: "none",
              scrollTrigger: {
                trigger: q(".explore-grid")[0],
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        });
      }
    }, root);
    return () => ctx.revert();
  }, [reduced, isDesktop]);

  // Split the 5 places across two desktop columns per their layout hint.
  const colA = exploreKerala.filter((_, i) => LAYOUTS[i % LAYOUTS.length].col === 0);
  const colB = exploreKerala.filter((_, i) => LAYOUTS[i % LAYOUTS.length].col === 1);
  const indexOf = (p: Place) => exploreKerala.indexOf(p);

  return (
    <section
      id="explore"
      ref={root}
      className="section-shell relative overflow-hidden py-28 sm:py-36"
    >
      {/* Ambient washes + a floating frond for texture */}
      <WatercolorBlob
        color="var(--palm)"
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 opacity-30"
      />
      <WatercolorBlob
        color="var(--terracotta)"
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 opacity-25"
      />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Explore Kerala"
          title="While you're here"
          script="a few of our favourite places"
        />

        {/* "a few ideas from us" note */}
        <Reveal className="mx-auto mt-6 max-w-xl text-center" y={20}>
          <p className="inline-flex items-center gap-2 font-sans text-sm leading-relaxed text-ink-soft">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
            A few ideas from us — our own picks coming soon.
          </p>
        </Reveal>

        {/* --- Pinterest-style offset masonry ---
            Mobile: one clean single column. Desktop: two offset columns. */}
        <div className="explore-grid mt-14 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-2 lg:gap-10">
          <div className="explore-col flex flex-col gap-8 lg:gap-10">
            {colA.map((p) => (
              <PlaceCard key={p.name} place={p} i={indexOf(p)} />
            ))}
          </div>
          <div className="explore-col flex flex-col gap-8 lg:gap-10">
            {colB.map((p) => (
              <PlaceCard key={p.name} place={p} i={indexOf(p)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
