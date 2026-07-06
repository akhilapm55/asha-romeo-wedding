"use client";

import { SplitWords } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

/** Shared editorial heading: eyebrow · title · optional script accent. */
export default function SectionHeading({
  eyebrow,
  title,
  script,
  align = "center",
  className,
  dark,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", dark && "text-gold-light")}>{eyebrow}</span>
      )}
      <h2
        className={cn(
          "font-sans text-2xl font-light uppercase leading-[1.15] tracking-[0.16em] sm:text-4xl sm:tracking-[0.2em]",
          dark ? "text-ivory" : "text-ink"
        )}
      >
        <SplitWords text={title} />
        {script && (
          <span className="script-accent mt-2 block text-3xl normal-case tracking-normal text-gold sm:text-5xl">
            {script}
          </span>
        )}
      </h2>
      <Ornament className={cn("w-40", align === "left" && "self-start")} />
    </div>
  );
}
