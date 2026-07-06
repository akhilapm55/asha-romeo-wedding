"use client";

import { useEffect, useRef } from "react";
import { useIsDesktop } from "@/lib/hooks";

/**
 * Soft trailing dot + ring cursor. Desktop only. Grows over interactive
 * elements. Never hijacks scrolling or clicks (pure decoration).
 */
export default function CustomCursor() {
  const desktop = useIsDesktop();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!desktop) return;
    document.documentElement.classList.add("custom-cursor-active");

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let raf = 0;

    const move = (e: PointerEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      if (dot.current)
        dot.current.style.transform = `translate(${dx}px, ${dy}px)`;
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,input,textarea,select,label,[data-cursor]");
      if (ring.current)
        ring.current.style.setProperty(
          "--s",
          interactive ? "2.4" : "1"
        );
    };

    const loop = () => {
      rx += (dx - rx) * 0.16;
      ry += (dy - ry) * 0.16;
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%) scale(var(--s,1))`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [desktop]);

  if (!desktop) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-palm mix-blend-multiply"
      />
      <div
        ref={ring}
        style={{ "--s": 1 } as React.CSSProperties}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-gold/70 transition-[width,height] duration-300 ease-out"
      />
    </>
  );
}
