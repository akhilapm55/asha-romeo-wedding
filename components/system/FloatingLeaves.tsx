"use client";

import { useMemo } from "react";
import { PalmLeaf } from "@/components/ui/Decor";
import { useReducedMotion } from "@/lib/hooks";

/** Ambient palm fronds drifting slowly behind the whole page. */
export default function FloatingLeaves({ count = 7 }: { count?: number }) {
  const reduced = useReducedMotion();
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37 + 8) % 96,
        size: 60 + ((i * 53) % 90),
        delay: (i * 1.7) % 9,
        dur: 16 + ((i * 7) % 14),
        rot: (i * 47) % 360,
        opacity: 0.05 + ((i * 13) % 7) / 100,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {leaves.map((l, i) => (
        <span
          key={i}
          className="absolute -top-40 text-palm animate-[drift_var(--d)_linear_infinite]"
          style={
            {
              left: `${l.left}%`,
              width: l.size,
              opacity: l.opacity,
              transform: `rotate(${l.rot}deg)`,
              "--d": `${l.dur}s`,
              animationDelay: `${l.delay}s`,
            } as React.CSSProperties
          }
        >
          <PalmLeaf className="w-full animate-leaf-sway" />
        </span>
      ))}
      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(120vh) rotate(220deg);
          }
        }
      `}</style>
    </div>
  );
}
