"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, BedDouble, Sparkles } from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { PalmLeaf } from "@/components/ui/Decor";
import MagneticButton from "@/components/ui/MagneticButton";
import { useReducedMotion, useIsDesktop } from "@/lib/hooks";
import { gsap } from "@/lib/gsap";
import { hotels, images, type Hotel } from "@/lib/content";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/*  Stylized mini-map flourish — NOT a real map iframe, pure CSS/SVG motif.    */
/* -------------------------------------------------------------------------- */
function MiniMap() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-ivory/50">
      <svg
        viewBox="0 0 320 130"
        className="h-28 w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* soft land / water wash */}
        <rect x="0" y="0" width="320" height="130" fill="var(--sand-light)" />
        <path
          d="M0 92 C 80 78, 150 104, 220 88 C 280 74, 320 92, 320 92 L320 130 L0 130 Z"
          fill="var(--ocean)"
          fillOpacity="0.16"
        />
        {/* faint route lines */}
        <path
          d="M28 104 C 90 96, 120 60, 176 54 C 224 49, 250 40, 292 30"
          stroke="var(--gold)"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeDasharray="4 6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40 34 C 96 44, 140 70, 200 82 C 240 90, 268 96, 300 110"
          stroke="var(--olive)"
          strokeOpacity="0.3"
          strokeWidth="1.2"
          strokeDasharray="3 7"
          strokeLinecap="round"
          fill="none"
        />
        {/* street grid ghosts */}
        <path
          d="M0 40 H320 M0 70 H320 M110 0 V130 M210 0 V130"
          stroke="var(--palm)"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      </svg>

      {/* Pin marker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%]">
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-ivory/90 shadow-md ring-2 ring-gold">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/25" />
          <MapPin className="relative h-4 w-4 text-terracotta" strokeWidth={2} />
        </span>
      </div>

      <span className="absolute bottom-2 right-3 font-sans text-[0.5rem] uppercase tracking-luxe text-ink-faint/70">
        You are here
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Single hotel card — desktop gets 3D tilt + lift; mobile stays static.      */
/* -------------------------------------------------------------------------- */
function HotelCard({
  hotel,
  index,
  desktop,
}: {
  hotel: Hotel;
  index: number;
  desktop: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hover, setHover] = useState(false);
  const isReady = hotel.status === "ready";

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!desktop || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: py * -6, ry: px * 6 });
  };
  const handleLeave = () => {
    setHover(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="stay-card group relative [perspective:1200px]"
      onMouseEnter={() => desktop && setHover(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={
        desktop
          ? { rotateX: tilt.rx, rotateY: tilt.ry, y: hover ? -8 : 0 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.6 }}
      style={desktop ? { transformStyle: "preserve-3d" } : undefined}
    >
      <div
        className={cn(
          "glass grain relative flex h-full flex-col overflow-hidden rounded-[1.75rem] transition-[box-shadow,border-color] duration-500",
          "border border-gold/15",
          hover
            ? "border-gold/45 shadow-[0_40px_90px_-45px_rgba(59,82,65,0.7)]"
            : "shadow-[0_24px_60px_-40px_rgba(59,82,65,0.5)]"
        )}
      >
        {/* --- Photography area --- */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 transition-transform duration-[900ms] ease-out",
              hover ? "scale-[1.08]" : "scale-100"
            )}
          >
            <PhotoPlaceholder
              index={index + 2}
              label={isReady ? hotel.name : "Photo coming soon"}
              src={images.hotels[hotel.name]}
              alt={hotel.name}
            />
          </div>

          {/* tag chip / status chip */}
          <div className="absolute left-4 top-4">
            {isReady && hotel.tag ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-palm/85 px-3 py-1.5 font-sans text-[0.55rem] uppercase tracking-luxe text-ivory backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-gold-light" strokeWidth={2} />
                {hotel.tag}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-ivory/70 px-3 py-1.5 font-sans text-[0.55rem] uppercase tracking-luxe text-ink-faint backdrop-blur-sm">
                Details coming soon
              </span>
            )}
          </div>

          {/* faint palm motif for pending cards */}
          {!isReady && (
            <PalmLeaf className="pointer-events-none absolute -bottom-6 right-2 w-24 rotate-6 text-palm/15" />
          )}
        </div>

        {/* --- Body --- */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <span className="eyebrow flex items-center gap-2 text-gold">
            <BedDouble className="h-3.5 w-3.5" strokeWidth={2} />
            {isReady ? "Stay" : "On the shortlist"}
          </span>

          <h3 className="mt-3 font-serif text-2xl leading-tight text-palm sm:text-[1.7rem]">
            {hotel.name}
          </h3>

          {isReady ? (
            <>
              {hotel.distance && (
                <p className="mt-2 font-sans text-xs uppercase tracking-wide2 text-gold-dark">
                  {hotel.distance}
                </p>
              )}
              {hotel.address && (
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
                  {hotel.address}
                </p>
              )}

              {/* stylized mini map flourish */}
              <MiniMap />

              {/* actions */}
              <div className="mt-auto pt-7">
                {hotel.mapUrl && (
                  <MagneticButton href={hotel.mapUrl} external variant="solid">
                    <MapPin className="h-4 w-4" strokeWidth={2} />
                    View on Maps
                  </MagneticButton>
                )}
                {hotel.website && (
                  <div className="mt-5">
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-wide2 text-ink-soft transition-colors hover:text-gold-dark"
                    >
                      Visit the resort website
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* pending empty state — intentional, never broken */
            <div className="mt-auto flex flex-1 flex-col items-start justify-end pt-6">
              <span className="h-px w-10 bg-gold/50" />
              <p className="mt-4 font-sans text-sm leading-relaxed text-ink-faint">
                Details coming soon. We&apos;re confirming rooms, rates, and the
                walk to the water — check back shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */
export default function Stay() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string): Element[] => self.selector!(s);

      // Cards wipe + settle in with a stagger as they enter the viewport.
      gsap.from(q(".stay-card"), {
        clipPath: "inset(0% 0% 100% 0% round 1.75rem)",
        yPercent: 8,
        rotate: -1.5,
        opacity: 0,
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.16,
        scrollTrigger: {
          trigger: q(".stay-grid")[0],
          start: "top 82%",
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="stay"
      ref={root}
      className="section-shell relative overflow-hidden py-28 sm:py-36"
    >
      {/* ambient palm decor */}
      <PalmLeaf className="pointer-events-none absolute -left-10 top-24 w-40 -rotate-12 text-palm/[0.06]" />
      <PalmLeaf className="pointer-events-none absolute -right-12 bottom-16 w-48 rotate-12 text-olive/[0.06]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Where To Stay"
          title="Rest easy by the coast"
          script="near the venue"
        />

        <p className="mx-auto mt-6 max-w-xl text-center font-sans text-sm leading-relaxed text-ink-soft sm:text-base">
          Pick a stay a short stroll from the celebrations. The resort is our
          home base, with a few trusted spots nearby — we&apos;ll share the
          full details as they&apos;re confirmed.
        </p>

        <div className="stay-grid mt-14 grid gap-7 sm:mt-20 lg:grid-cols-3 lg:gap-8">
          {hotels.map((hotel, i) => (
            <HotelCard
              key={hotel.name}
              hotel={hotel}
              index={i}
              desktop={desktop}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
