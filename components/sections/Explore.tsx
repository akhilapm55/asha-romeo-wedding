"use client";

import { useLayoutEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { WatercolorBlob } from "@/components/ui/Decor";
import { useReducedMotion } from "@/lib/hooks";
import { gsap } from "@/lib/gsap";
import { exploreKerala, images, type Place } from "@/lib/content";

function PlaceCard({ place, i }: { place: Place; i: number }) {
  return (
    <article
      className="explore-card group relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
      style={{ willChange: "transform" }}
    >
      <div className="explore-frame relative overflow-hidden rounded-[1.75rem] border border-gold/15 bg-ivory/40 shadow-[0_30px_70px_-40px_rgba(59,82,65,0.5)]">
        {/* Image well — inner layer is slightly oversized so the scrub zoom
            never reveals an edge. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <div className="explore-photo absolute inset-0 will-change-transform">
            <PhotoPlaceholder
              index={i}
              label={place.name}
              className="scale-[1.04]"
              src={images.explore[place.name]}
              alt={place.name}
            />
          </div>

          {/* legibility wash + kind chip */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-palm/45 via-palm/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-ivory/30 bg-ink/35 px-3 py-1 font-sans text-[0.55rem] uppercase tracking-luxe text-ivory backdrop-blur-sm">
            {place.kind}
          </span>
        </div>

        {/* Caption block */}
        <div className="relative px-5 pb-6 pt-4 sm:px-6">
          <h3 className="font-serif text-xl leading-tight text-palm sm:text-2xl">
            {place.name}
          </h3>
          <span className="mt-3 block h-px w-10 bg-gold/50 transition-all duration-500 group-hover:w-16" />
          <p className="mt-3 font-sans text-[0.88rem] leading-relaxed text-ink-soft">
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

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string): Element[] => self.selector!(s);

      q(".explore-card").forEach((el) => {
        const card = el as HTMLElement;

        // Enter reveal: rise + fade.
        gsap.from(card, {
          y: 56,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });

        // Gentle image zoom on scroll for an alive, editorial feel.
        const photo = card.querySelector(".explore-photo");
        if (photo)
          gsap.fromTo(
            photo,
            { scale: 1.08 },
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
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="explore"
      ref={root}
      className="section-shell relative overflow-hidden py-24 sm:py-32"
    >
      {/* Ambient washes for texture */}
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

        {/* Centered wrap grid: 3 per row on desktop, then the rest centered
            below (5 places → 3 on top, 2 centered underneath). */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 sm:mt-16">
          {exploreKerala.map((p, i) => (
            <PlaceCard key={p.name} place={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
