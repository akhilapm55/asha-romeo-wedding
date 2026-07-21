"use client";

import { PalmLeaf } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

/**
 * Ambient palm fronds placed statically around the page. They don't fall —
 * each just sways gently in place (leaf-sway). On phones we keep only a few,
 * smaller, so the narrow screen doesn't look crowded.
 */
const LEAVES = [
  { top: "5%", left: "-3%", rot: 18, size: 130, opacity: 0.11, delay: 0, mobile: true },
  { top: "3%", left: "74%", rot: 305, size: 120, opacity: 0.1, delay: 1.4, mobile: false },
  { top: "34%", left: "90%", rot: -28, size: 150, opacity: 0.1, delay: 0.7, mobile: true },
  { top: "45%", left: "-6%", rot: -10, size: 110, opacity: 0.1, delay: 2.1, mobile: false },
  { top: "66%", left: "84%", rot: 150, size: 130, opacity: 0.1, delay: 1, mobile: false },
  { top: "85%", left: "-4%", rot: 205, size: 140, opacity: 0.1, delay: 2.6, mobile: true },
  { top: "88%", left: "70%", rot: 165, size: 100, opacity: 0.09, delay: 0.4, mobile: false },
];

export default function FloatingLeaves() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className={cn(
            "absolute text-palm",
            // full size on sm+, ~65% on mobile; hide the extra ones on phones
            l.mobile ? "block" : "hidden sm:block"
          )}
          style={{
            top: l.top,
            left: l.left,
            width: l.size,
            maxWidth: "42vw",
            opacity: l.opacity,
            transform: `rotate(${l.rot}deg)`,
          }}
        >
          <PalmLeaf
            className="w-[65%] animate-leaf-sway sm:w-full"
            style={{ animationDelay: `${l.delay}s` }}
          />
        </span>
      ))}
    </div>
  );
}
