"use client";

import { useLayoutEffect, useRef } from "react";
import { Plane, Navigation, MapPin, Car, Globe } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

import { useReducedMotion } from "@/lib/hooks";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { travel } from "@/lib/content";
import { cn } from "@/lib/cn";

const stepIcons = [Plane, Navigation] as const;

export default function Travel() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string): Element[] => self.selector!(s);

      /* --- Plane on curved dotted path (draw path + move plane on scroll) --- */
      const path = q(".travel-path")[0] as SVGPathElement | undefined;
      const plane = q(".travel-plane")[0] as HTMLElement | undefined;
      const svg = q(".travel-map")[0] as SVGSVGElement | undefined;

      if (path && plane && svg) {
        const total = path.getTotalLength();
        gsap.set(plane, { opacity: 0 });

        const drawPath = q(".travel-draw")[0] as SVGPathElement | undefined;
        const drawLen = drawPath ? drawPath.getTotalLength() : 0;
        if (drawPath) {
          gsap.set(drawPath, { strokeDasharray: drawLen, strokeDashoffset: drawLen });
        }

        const place = (progress: number) => {
          const clamped = Math.max(0, Math.min(1, progress));
          const p = path.getPointAtLength(clamped * total);
          // Look-ahead point to angle the plane along the tangent.
          const ahead = path.getPointAtLength(Math.min(total, clamped * total + 2));
          const angle =
            (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
          // Convert SVG user units to CSS pixels via the current viewBox scale.
          const rect = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal;
          const sx = rect.width / (vb.width || 1);
          const sy = rect.height / (vb.height || 1);
          gsap.set(plane, {
            x: p.x * sx,
            y: p.y * sy,
            rotation: angle,
            xPercent: -50,
            yPercent: -50,
          });
        };
        place(0);

        // The plane flies the whole path once, when the map scrolls into view.
        const flight = { p: 0 };
        gsap.to(flight, {
          p: 1,
          duration: 3,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: svg,
            start: "top 78%",
            toggleActions: "play none none none",
          },
          onStart: () => gsap.set(plane, { opacity: 1 }),
          onUpdate: () => {
            place(flight.p);
            if (drawPath)
              gsap.set(drawPath, { strokeDashoffset: drawLen * (1 - flight.p) });
          },
          onComplete: () => gsap.to(plane, { opacity: 0, duration: 0.5 }),
        });
      }

      /* --- Step cards slide upward with stagger --- */
      q(".travel-step").forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        });
      });

      /* --- Step icons gently bounce/rotate on reveal --- */
      q(".travel-step-icon").forEach((icon) => {
        gsap.from(icon, {
          scale: 0.4,
          rotate: -25,
          opacity: 0,
          duration: 0.9,
          ease: "back.out(2)",
          scrollTrigger: { trigger: icon, start: "top 88%" },
        });
      });

      /* --- Airport mini-cards --- */
      q(".travel-airport").forEach((c, i) => {
        gsap.from(c, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: c, start: "top 90%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="travel"
      ref={root}
      className="section-shell grain relative overflow-hidden py-20 sm:py-28"
    >
      {/* soft botanical accents */}

      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Getting Here"
          title="The journey to Nileshwaram"
        />

        {/* ----------------------------------------------------------------- */}
        {/*  SIGNATURE MOTION — plane along a curved dotted path              */}
        {/* ----------------------------------------------------------------- */}
        <div className="relative mx-auto mt-8 w-full max-w-4xl sm:mt-10">
          <svg
            className="travel-map w-full"
            viewBox="0 0 800 220"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Faint full guide path (dotted) */}
            <path
              className="travel-path"
              d="M70 165 C 220 30, 340 30, 400 110 S 590 195, 730 60"
              stroke="var(--gold)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="2 10"
              opacity="0.4"
            />
            {/* Drawn-in overlay path (revealed on scroll) */}
            <path
              className="travel-draw"
              d="M70 165 C 220 30, 340 30, 400 110 S 590 195, 730 60"
              stroke="var(--palm)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="6 8"
              opacity="0.7"
            />

            {/* Start node — airport */}
            <g>
              <circle cx="70" cy="165" r="20" fill="var(--ivory)" />
              <circle
                cx="70"
                cy="165"
                r="20"
                stroke="var(--gold)"
                strokeWidth="1.5"
                fill="none"
              />
              <g transform="translate(58 153)">
                <path
                  d="M17.8 10.2 21 10.2c.9 0 1.5.7 1.5 1.5s-.6 1.5-1.5 1.5l-3.2 0-3 5.3c-.2.4-.6.6-1 .6l-1.1 0 1.5-5.9-3.6 0-1.4 1.9c-.2.3-.5.4-.8.4l-.9 0 1.1-3.8-1.1-3.8.9 0c.3 0 .6.1.8.4l1.4 1.9 3.6 0-1.5-5.9 1.1 0c.4 0 .8.2 1 .6l3 5.1Z"
                  fill="var(--palm)"
                />
              </g>
            </g>

            {/* End node — destination pin */}
            <g>
              <circle cx="730" cy="60" r="20" fill="var(--ivory)" />
              <circle
                cx="730"
                cy="60"
                r="20"
                stroke="var(--gold)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M730 49c-3.6 0-6.5 2.9-6.5 6.5 0 4.9 6.5 12 6.5 12s6.5-7.1 6.5-12c0-3.6-2.9-6.5-6.5-6.5Zm0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                fill="var(--terracotta)"
              />
            </g>
          </svg>

          {/* Plane driven along the path */}
          <div className="pointer-events-none absolute left-0 top-0">
            <div className="travel-plane text-palm">
              <Plane className="h-7 w-7 fill-gold/30" strokeWidth={1.6} />
            </div>
          </div>

          {/* labels */}
          <div className="mt-3 flex items-center justify-between px-2">
            <span className="eyebrow text-ink-faint">Airport</span>
            <span className="eyebrow text-ink-faint">Nileshwaram</span>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/*  STEP CARDS                                                       */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-12 flex flex-col gap-6 sm:mt-14">
          {travel.steps.map((step, i) => {
            const Icon = stepIcons[i] ?? Plane;
            return (
              <article
                key={step.step}
                className="travel-step glass relative overflow-hidden rounded-3xl p-7 sm:p-10"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                  {/* Big step number */}
                  <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start">
                    <span className="script-accent text-5xl leading-none text-gold sm:text-6xl">
                      {step.step}
                    </span>
                    <span className="travel-step-icon inline-flex h-12 w-12 items-center justify-center rounded-full bg-sand-light/60 text-palm">
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-palm sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 font-sans text-[0.98rem] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>

                    {/* Airports inside step 02 */}
                    {"airports" in step && step.airports && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {step.airports.map((a) => (
                          <div
                            key={a.code}
                            className={cn(
                              "travel-airport relative rounded-2xl border p-5 transition-colors",
                              a.recommended
                                ? "border-gold/50 bg-gold/[0.06]"
                                : "border-ink-faint/20 bg-ivory/40"
                            )}
                          >
                            {a.recommended && (
                              <span className="absolute -top-3 right-4 rounded-full bg-gold px-3 py-1 text-[0.62rem] font-sans uppercase tracking-wide2 text-ivory shadow-sm">
                                Recommended
                              </span>
                            )}
                            <div className="flex items-baseline gap-3">
                              <span className="font-serif text-3xl leading-none text-palm sm:text-4xl">
                                {a.code}
                              </span>
                              <span className="font-sans text-sm uppercase tracking-wide2 text-ink-soft">
                                {a.name}
                              </span>
                            </div>
                            <p className="mt-3 font-sans text-sm leading-relaxed text-ink-soft">
                              {a.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/*  TRANSPORT CALLOUT + LANGUAGE NOTE                                */}
        {/* ----------------------------------------------------------------- */}
        <Reveal className="mt-10">
          <div className="glass flex items-start gap-4 rounded-3xl bg-sand-light/50 p-6 sm:p-8">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-palm/10 text-palm">
              <Car className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="font-serif text-lg leading-relaxed text-palm sm:text-xl">
              {travel.transportNote}
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8" delay={0.1}>
          <div className="flex items-center justify-center gap-3 text-center">
            <Globe
              className="h-4 w-4 shrink-0 text-gold"
              strokeWidth={1.6}
              aria-hidden
            />
            <p className="font-sans text-sm leading-relaxed text-ink-soft">
              {travel.languageNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
