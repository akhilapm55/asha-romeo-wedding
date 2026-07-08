"use client";

import { footer, couple, eventMeta, venue, families, images } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament, PalmLeaf } from "@/components/ui/Decor";
import { PhotoPlaceholder } from "@/components/ui/Placeholder";
import { scrollToTarget } from "@/components/providers/SmoothScroll";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-palm-dark px-6 pb-10 pt-24 text-ivory">
      {/* watercolor palms */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden>
        <PalmLeaf className="absolute -left-10 bottom-0 w-56 rotate-[14deg] text-ivory" />
        <PalmLeaf className="absolute -right-10 bottom-0 w-56 -rotate-[16deg] text-ivory" />
        <PalmLeaf className="absolute left-1/2 -top-10 w-40 -translate-x-1/2 rotate-180 text-gold-light" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* waving caricature slot */}
        {/* <Reveal>
          <div className="mx-auto mb-8 h-28 w-28 overflow-hidden rounded-full border border-gold/40">
            <PhotoPlaceholder label="Caricature waving goodbye" index={1} className="rounded-full" labelClassName="text-[0.5rem] text-ivory/70" src={images.footerCaricature} alt="Caricature waving goodbye" />
          </div>
        </Reveal> */}

        <Reveal delay={0.1}>
          <p className="script-accent text-4xl text-gold-light sm:text-5xl">Thank you</p>
          <h2 className="mt-3 font-sans text-2xl font-light uppercase tracking-[0.2em] text-ivory sm:text-4xl">
            {couple.bride.first} <span className="text-gold-light">+</span>{" "}
            {couple.groom.first}
          </h2>
          <Ornament className="mx-auto my-8 w-44 text-gold-light" />
          <p className="mx-auto max-w-lg font-sans text-sm leading-relaxed text-ivory/75">
            {footer.message}
          </p>
          <p className="mt-6 script-accent text-3xl text-gold-light">{footer.signoff}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 space-y-1 font-sans text-xs uppercase tracking-wide2 text-ivory/60">
            <p>{eventMeta.dateLine}</p>
            <p>{venue.name} · {eventMeta.location}</p>
          </div>

          {/* PENDING: contact person(s) / hashtag */}
          {footer.contact ? (
            <p className="mt-4 font-sans text-xs text-ivory/60">Questions? {footer.contact}</p>
          ) : (
            <p className="mt-4 font-sans text-[0.68rem] italic text-ivory/40">
              Contact details coming soon
            </p>
          )}
          {couple.hashtag && (
            <p className="mt-2 font-sans text-sm tracking-wide text-gold-light">
              #{couple.hashtag}
            </p>
          )}

          <button
            onClick={() => scrollToTarget("#hero")}
            className="mt-10 font-sans text-[0.68rem] uppercase tracking-luxe text-ivory/50 transition hover:text-gold-light link-underline"
          >
            Back to top ↑
          </button>
        </Reveal>

        <div className="mt-12 border-t border-ivory/10 pt-6 font-sans text-[0.62rem] tracking-wide text-ivory/35">
          <p>
            With love, {families.venugopalans} &amp; {families.grays}
          </p>
        </div>
      </div>
    </footer>
  );
}
