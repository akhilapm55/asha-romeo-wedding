"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { events, venue, images } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { PalmLeaf, Ornament } from "@/components/ui/Decor";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { SplitWords } from "@/components/ui/Reveal";
import { scrollToTarget } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

const venueLocation = "Nileshwar, Kerala, India";

/** One side of the symmetric layout — a compact event summary. */
function EventSide({
  name,
  day,
  when,
  blurb,
  attire,
  align,
  accent,
}: {
  name: string;
  day: string;
  when: string;
  blurb: string;
  attire: string;
  align: "left" | "right";
  accent: string;
}) {
  const right = align === "right";
  return (
    <div
      className={cn(
        "event-side flex flex-col gap-4",
        right ? "lg:items-start lg:text-left" : "lg:items-end lg:text-right",
        "items-center text-center"
      )}
    >
      <p className={cn("script-accent text-4xl sm:text-5xl", accent)}>{name}</p>

      {/* time / day pill */}
      <div className="rounded-full border border-gold/40 bg-ivory/70 px-6 py-2 shadow-sm backdrop-blur">
        <span className="font-serif text-lg text-palm">{day}</span>
      </div>
      <span className="font-sans text-[0.68rem] uppercase tracking-luxe text-ink-faint">
        {when}
      </span>

      <div className="space-y-0.5">
        <p className="font-serif text-lg text-palm">{venue.name}</p>
        <p className="font-sans text-sm text-ink-soft">{venueLocation}</p>
      </div>

      <p className="max-w-sm font-sans text-[0.92rem] leading-relaxed text-ink-soft">
        {blurb}
      </p>

      <div
        className={cn(
          "w-full max-w-sm rounded-2xl px-5 py-3",
          right ? "bg-palm/5" : "bg-sand-light/60"
        )}
      >
        <p className="font-sans text-[0.6rem] uppercase tracking-luxe text-gold-dark">
          Attire
        </p>
        <p className="mt-1 font-sans text-[0.82rem] leading-relaxed text-ink-soft">
          {attire}
        </p>
      </div>

      <a
        href={venue.mapUrl}
        target="_blank"
        rel="noreferrer"
        data-cursor
        className="group inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wide2 text-palm transition hover:text-terracotta"
      >
        <MapPin size={15} className="text-terracotta" />
        Open map
      </a>
    </div>
  );
}

export default function Events() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  const { sangeet, wedding } = events;

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string) => self.selector!(s);
      gsap.from(q(".event-head > *"), {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
      gsap.from(q(".event-side"), {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: q(".event-grid")[0], start: "top 80%" },
      });
      gsap.from(q(".event-center"), {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: q(".event-grid")[0], start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="events"
      ref={root}
      className="section-shell relative overflow-x-clip bg-gradient-to-b from-ivory to-ivory-warm py-28 sm:py-36"
    >
      <PalmLeaf className="pointer-events-none absolute -left-10 bottom-10 w-44 rotate-12 text-palm/10" />
      <PalmLeaf className="pointer-events-none absolute -right-10 top-16 w-40 -rotate-12 text-olive/10" />

      <div className="mx-auto max-w-editorial">
        <div className="event-head mb-16 text-center">
          <span className="eyebrow">Ceremony &amp; Celebration</span>
          <h2 className="mt-4 font-sans text-2xl font-light uppercase tracking-[0.16em] text-ink sm:text-4xl sm:tracking-[0.2em]">
            <SplitWords text="The wedding events" />
          </h2>
          <Ornament className="mx-auto mt-5 w-40" />
        </div>

        {/* symmetric layout: event · couple · event */}
        <div className="event-grid grid items-center gap-14 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <EventSide
            name={sangeet.name}
            day={sangeet.day}
            when={sangeet.when}
            blurb={sangeet.blurb}
            attire={sangeet.attire}
            align="left"
            accent="text-terracotta"
          />

          {/* center — couple illustration + RSVP */}
          <div className="event-center flex flex-col items-center gap-6">
            <div className="relative h-52 w-52 sm:h-60 sm:w-60">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/15 via-terracotta/10 to-palm/10 blur-xl" />
              <div className="relative h-full w-full overflow-hidden rounded-full border border-gold/30 shadow-xl">
                <PhotoPlaceholder
                  label="Couple"
                  index={4}
                  className="rounded-full"
                  imgClassName="object-top"
                  src={images.heroCaricature}
                  alt="Asha & Romeo"
                />
              </div>
            </div>
            <button
              onClick={() => scrollToTarget("#rsvp")}
              data-cursor
              className="rounded-full bg-terracotta px-10 py-3 font-sans text-sm uppercase tracking-wide2 text-ivory shadow-lg transition hover:bg-terracotta/90 hover:shadow-xl"
            >
              RSVP
            </button>
          </div>

          <EventSide
            name={wedding.name}
            day={wedding.day}
            when={wedding.when}
            blurb={wedding.blurb}
            attire={wedding.attire}
            align="right"
            accent="text-palm"
          />
        </div>

        {/* expandable full wedding-day schedule */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setOpen((v) => !v)}
            data-cursor
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-2.5 font-sans text-[0.7rem] uppercase tracking-wide2 text-palm transition hover:bg-gold/10"
          >
            {open ? "Hide the wedding day" : "See the wedding day, hour by hour"}
            <ChevronDown
              size={15}
              className={cn("transition-transform", open && "rotate-180")}
            />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <ul className="mx-auto mt-10 grid max-w-3xl gap-x-10 gap-y-7 text-left sm:grid-cols-2">
                  {wedding.schedule.map((item, i) => (
                    <li key={i} className="relative border-l border-gold/30 pl-5">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" />
                      <p className="font-serif text-lg text-palm">
                        <span className="text-terracotta">{item.time}</span> · {item.title}
                      </p>
                      <p className="mt-1 font-sans text-[0.86rem] leading-relaxed text-ink-soft">
                        {item.detail}
                      </p>
                      {item.ritual && (
                        <ul className="mt-2 space-y-1">
                          {item.ritual.map((r, k) => (
                            <li
                              key={k}
                              className="font-sans text-[0.82rem] italic leading-relaxed text-ink-faint"
                            >
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
