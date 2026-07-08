"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { families, eventMeta, venue, couple } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { PalmLeaf, Ornament } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Line = { text: string; kind: "name" | "script" };

export default function Welcome() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string) => self.selector!(s);
      // Watercolor wash grows as the section enters.
      gsap.fromTo(
        q(".wash"),
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "center center",
            scrub: true,
          },
        }
      );
      // Invitation words rise line by line.
      gsap.from(q(".line"), {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: q(".invite"), start: "top 78%" },
      });
      gsap.from(q(".palm-in"), {
        scale: 0.6,
        opacity: 0,
        rotate: -12,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const lines: Line[] = [
    { text: families.brideParents, kind: "name" },
    { text: "and", kind: "script" },
    { text: families.groomParents, kind: "name" },
    { text: "invite you to celebrate the wedding of", kind: "script" },
  ];

  return (
    <section
      id="welcome"
      ref={root}
      className="section-shell grain relative overflow-hidden py-28 sm:py-36"
    >
      {/* growing watercolor wash */}
      <div className="wash pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vw] w-[70vw] max-h-[680px] max-w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(110,115,85,0.18),rgba(191,159,99,0.08)_45%,transparent_70%)]" />
      <PalmLeaf className="palm-in absolute -left-6 top-16 w-28 rotate-[20deg] text-palm/20 sm:w-40" />
      <PalmLeaf className="palm-in absolute -right-6 bottom-16 w-28 -rotate-[24deg] text-olive/20 sm:w-40" />

      <div className="invite mx-auto max-w-3xl text-center">
        <div className="space-y-5 sm:space-y-6">
          {lines.map((l, i) => (
            // extra vertical padding so the cursive descenders aren't clipped
            <div key={i} className="split-line py-1">
              <p
                className={cn(
                  "line",
                  l.kind === "script"
                    ? "script-accent text-3xl leading-[1.35] text-gold sm:text-4xl"
                    : "font-serif text-2xl leading-relaxed text-palm sm:text-3xl"
                )}
              >
                {l.text}
              </p>
            </div>
          ))}
        </div>

        <div className="split-line mt-7 py-1">
          <p className="line font-sans text-xl font-light uppercase tracking-[0.12em] text-ink sm:text-3xl">
            {couple.bride.full} <span className="text-gold">+</span>{" "}
            {couple.groom.full}
          </p>
        </div>

        <Ornament className="mx-auto my-12 w-48" />

        <Reveal delay={0.15}>
          <div className="flex flex-col items-center gap-1 font-sans text-sm text-ink-soft">
            <p className="text-base tracking-wide text-palm">{eventMeta.dateLine}</p>
            <p>{eventMeta.location}</p>
            <p className="mt-2 font-serif text-lg text-ink">{venue.name}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
