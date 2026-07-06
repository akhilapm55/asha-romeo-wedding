"use client";

import { useEffect, useRef, useState } from "react";
import { PalmLeaf } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

const TINTS = [
  "from-sand-light to-sand",
  "from-olive/15 to-palm/15",
  "from-ocean/10 to-sand-light",
  "from-terracotta/10 to-sand",
  "from-gold/12 to-ivory-deep",
];

/** A photo slot that looks intentional while real images are PENDING. */
export function PhotoPlaceholder({
  label = "Photo coming soon",
  index = 0,
  className,
  labelClassName,
  imgClassName,
  src,
  alt,
}: {
  label?: string;
  index?: number;
  className?: string;
  labelClassName?: string;
  /** Extra classes on the <img> itself — e.g. object-position like
   *  "object-top" or "object-[center_25%]" to control the crop focus. */
  imgClassName?: string;
  /** Path under /public (e.g. "/images/couple/couple-hero.jpg").
   *  If the file exists it renders over the placeholder; if it's missing
   *  or empty, the elegant placeholder shows instead. */
  src?: string;
  alt?: string;
}) {
  const tint = TINTS[index % TINTS.length];
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImage = Boolean(src) && !failed;

  // Cached images can finish loading before React attaches onLoad, so the event
  // never fires. Catch that case on mount by inspecting the element directly.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      if (el.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [src, showImage]);
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        tint,
        className
      )}
    >
      <div className="grain absolute inset-0" />
      <PalmLeaf className="absolute -right-6 -top-8 w-28 rotate-12 text-palm/10" />
      <PalmLeaf className="absolute -bottom-10 -left-8 w-32 -rotate-12 text-olive/10" />
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <span className="h-px w-8 bg-gold/60" />
        <span
          className={cn(
            "font-sans text-[0.6rem] uppercase tracking-luxe text-ink-faint",
            labelClassName
          )}
        >
          {label}
        </span>
      </div>
      {/* real image (drops in over the placeholder; falls back on error) */}
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt || label}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 z-30 h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
      {/* shimmer sweep */}
      {!showImage && (
        <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmerSweep_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      )}
      <style jsx>{`
        @keyframes shimmerSweep {
          0%,
          60% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
