"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { gallery, images, type GalleryTile } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import SectionHeading from "@/components/ui/SectionHeading";
import { PalmLeaf, Ornament } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;

  /* ---- GSAP: tiles pop in one-by-one as the grid scrolls into view ---- */
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context((self) => {
      const q = (s: string): Element[] => self.selector!(s);
      const tiles = q(".gallery-tile") as unknown as HTMLElement[];

      gsap.set(tiles, { opacity: 0, y: 40, scale: 0.94 });

      ScrollTrigger.batch(tiles, {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            overwrite: true,
          }),
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  /* ---- Lightbox controls ---- */
  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (dir: number) =>
      setActive((cur) =>
        cur === null ? cur : (cur + dir + gallery.length) % gallery.length
      ),
    []
  );

  // Keyboard + body-scroll lock while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, go]);

  const activeTile: GalleryTile | null =
    active === null ? null : gallery[active];

  return (
    <section
      id="gallery"
      ref={root}
      className="section-shell relative overflow-hidden bg-ivory-warm py-28 sm:py-36"
    >

      <PalmLeaf className="pointer-events-none absolute -left-6 top-16 w-40 rotate-[24deg] text-olive/10" />
      <PalmLeaf className="pointer-events-none absolute -right-8 bottom-24 w-44 -rotate-[18deg] text-palm/10" />

      <div className="mx-auto max-w-editorial">
        <SectionHeading
          eyebrow="Moments"
          title="A gallery of us"
          script="more to come"
        />

        <p className="mx-auto mt-6 max-w-md text-center font-sans text-[0.92rem] leading-relaxed text-ink-soft">
          We&rsquo;re still gathering our favourite frames. Photographs from the
          celebrations will bloom here soon &mdash; do check back.
        </p>

        <div className="mt-14 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {gallery.map((tile, i) => (
            <button
              key={tile.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Open photo ${tile.id} in fullscreen`}
              className="gallery-tile group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-gold/20 shadow-sm outline-none transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-gold hover:shadow-xl sm:mb-4"
            >
              <div
                className={cn(
                  "relative w-full",
                  tile.orientation === "portrait"
                    ? "aspect-[3/4]"
                    : "aspect-[4/3]"
                )}
              >
                <PhotoPlaceholder
                  label={tile.caption || `Photo ${tile.id}`}
                  index={i}
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  src={images.gallery[i]}
                  alt={`Gallery photo ${tile.id}`}
                />
                <span className="pointer-events-none absolute inset-0 bg-palm/0 transition-colors duration-500 group-hover:bg-palm/10" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Ornament className="w-48" />
        </div>
      </div>

      {/* ---- Lightbox ---- */}
      <AnimatePresence>
        {open && activeTile && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo ${activeTile.id}, ${activeTile.caption}`}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={close}
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" />

            {/* close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="glass absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-ivory outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            {/* prev */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous photo"
              className="glass absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ivory outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold sm:left-6 sm:h-14 sm:w-14"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next photo"
              className="glass absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ivory outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold sm:right-6 sm:h-14 sm:w-14"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* stage */}
            <motion.figure
              key={activeTile.id}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex w-full max-w-3xl flex-col items-center"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* whole photo, uncropped — no forced aspect ratio */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.gallery[active ?? 0]}
                alt={`Gallery photo ${activeTile.id}`}
                className="max-h-[76vh] w-auto max-w-full rounded-2xl border border-gold/30 object-contain shadow-2xl"
              />
              <figcaption className="mt-5 text-center">
                {activeTile.caption && (
                  <span className="font-sans text-[0.7rem] uppercase tracking-luxe text-ivory/70">
                    {activeTile.caption}
                  </span>
                )}
                <span className="mt-1 block font-serif text-sm text-ivory/50">
                  {activeTile.id} / {gallery.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
