"use client";

import { useLayoutEffect, useRef } from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { WatercolorBlob } from "@/components/ui/Decor";
import MagneticButton from "@/components/ui/MagneticButton";
import { useReducedMotion } from "@/lib/hooks";
import { gsap } from "@/lib/gsap";
import { venue, eventMeta, images } from "@/lib/content";

export default function Venue() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string) => self.selector!(s);

      // Cinematic parallax: image scales in as the section scrolls through.
      const img = q(".venue-parallax")[0];
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.18, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: q(".venue-frame")[0],
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Frame wipes open.
      gsap.from(q(".venue-frame"), {
        clipPath: "inset(12% 8% 12% 8% round 2rem)",
        opacity: 0.5,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".venue-frame")[0], start: "top 84%" },
      });

      // Pin drops in, then hands off to the CSS bob.
      gsap.from(q(".venue-pin"), {
        y: -40,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.4,
        scrollTrigger: { trigger: q(".venue-frame")[0], start: "top 78%" },
      });

      gsap.from(q(".venue-card"), {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".venue-card")[0], start: "top 86%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="venue"
      ref={root}
      className="section-shell relative overflow-hidden py-28 sm:py-36"
    >
      {/* Soft ambient washes */}
      <WatercolorBlob
        color="var(--ocean)"
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 opacity-40"
      />
      <WatercolorBlob
        color="var(--gold)"
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 opacity-30"
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Venue"
          title="Where two worlds meet the sea"
          script="by the shore"
        />

        <div className="mt-14 grid gap-8 sm:mt-20 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* --- Cinematic beach visual --- */}
          <div className="lg:col-span-7">
            <div className="venue-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-40px_rgba(59,82,65,0.55)] sm:aspect-[4/3] lg:h-full lg:aspect-auto">
              {/* Parallax image layer (oversized so scale/shift never reveals edges) */}
              <div className="venue-parallax absolute inset-0 will-change-transform">
                <PhotoPlaceholder
                  index={2}
                  label={venue.name}
                  className="scale-110"
                  src={images.venue}
                  alt={venue.name}
                />
              </div>

              {/* Animated golden sunlight */}
              <div className="venue-sun pointer-events-none absolute inset-0" />

              {/* Ocean shimmer welcome band */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-palm/45 via-palm/10 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
                <span className="script-accent venue-shimmer text-2xl text-ivory sm:text-3xl">
                  Welcome to the shore
                </span>
              </div>

              {/* Floating location pin */}
              <div className="venue-pin absolute left-1/2 top-8 -translate-x-1/2 sm:left-8 sm:translate-x-0">
                <div className="venue-bob flex items-center gap-3">
                  <span className="relative grid h-12 w-12 place-items-center rounded-full bg-ivory/90 shadow-lg ring-2 ring-gold">
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
                    <MapPin className="relative h-5 w-5 text-terracotta" strokeWidth={2} />
                  </span>
                  <span className="rounded-full bg-ink/45 px-3 py-1.5 font-sans text-[0.62rem] uppercase tracking-luxe text-ivory backdrop-blur-sm">
                    {venue.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Map / details card --- */}
          <div className="lg:col-span-5">
            <div className="venue-card glass grain relative flex h-full flex-col rounded-[2rem] p-7 sm:p-9">
              <span className="eyebrow flex items-center gap-2 text-gold">
                <Navigation className="h-3.5 w-3.5" strokeWidth={2} />
                {eventMeta.location}
              </span>

              <h3 className="mt-4 font-serif text-3xl leading-tight text-palm sm:text-4xl">
                {venue.name}
              </h3>

              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
                {venue.address}
              </p>

              {/* Distances */}
              <Stagger className="mt-7 flex flex-col gap-3" stagger={0.1}>
                {venue.distances.map((d) => (
                  <StaggerItem key={d.label}>
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gold/15 bg-ivory/40 px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-serif text-lg text-palm">
                          {d.label}
                        </span>
                        <span className="font-sans text-xs text-ink-faint">
                          {d.detail}
                        </span>
                      </div>
                      {d.recommended && (
                        <span className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 font-sans text-[0.55rem] uppercase tracking-luxe text-gold-dark">
                          Recommended
                        </span>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Actions */}
              <div className="mt-auto pt-8">
                <MagneticButton href={venue.mapUrl} external variant="solid">
                  <MapPin className="h-4 w-4" strokeWidth={2} />
                  View on Maps
                </MagneticButton>

                <div className="mt-5">
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide2 text-ink-soft transition-colors hover:text-gold-dark"
                  >
                    Visit the resort website
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component-scoped keyframes: sunlight pulse, pin bob, shimmer */}
      <style jsx>{`
        .venue-sun {
          background: radial-gradient(
              120% 90% at 78% 12%,
              rgba(214, 178, 106, 0.42) 0%,
              rgba(214, 178, 106, 0.16) 26%,
              transparent 58%
            ),
            radial-gradient(
              60% 50% at 70% 8%,
              rgba(255, 244, 214, 0.5) 0%,
              transparent 55%
            );
          mix-blend-mode: screen;
          animation: venueSun 7s ease-in-out infinite;
        }
        @keyframes venueSun {
          0%,
          100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }
        .venue-bob {
          animation: venueBob 4.5s ease-in-out infinite;
        }
        @keyframes venueBob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
          }
        }
        .venue-shimmer {
          animation: venueShimmer 5s ease-in-out infinite;
        }
        @keyframes venueShimmer {
          0%,
          100% {
            opacity: 0.7;
            filter: drop-shadow(0 0 6px rgba(255, 244, 214, 0.2));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 14px rgba(255, 244, 214, 0.55));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .venue-sun,
          .venue-bob,
          .venue-shimmer {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
