"use client";

import { families } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import { PalmLeaf } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";

/** "Meet the families" — moved out of Welcome so it follows Our Story. */
export default function Families() {
  return (
    <section
      id="families"
      className="section-shell relative overflow-x-clip py-20 sm:py-28"
    >

      <PalmLeaf className="pointer-events-none absolute -left-6 bottom-10 w-32 rotate-[18deg] text-palm/10 sm:w-40" />

      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Meet the families" title="The two families" />

        <Reveal>
          <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-2">
            <div className="glass rounded-2xl px-6 py-6 text-center">
              <p className="font-serif text-xl text-palm">The Venugopalans</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-soft">
                {families.venugopalans}
              </p>
            </div>
            <div className="glass rounded-2xl px-6 py-6 text-center">
              <p className="font-serif text-xl text-palm">The Grays</p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-soft">
                {families.grays}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
