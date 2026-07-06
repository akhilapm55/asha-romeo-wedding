"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Palm-leaf confetti burst (canvas). Each piece is a little frond, not paper.
 * Fires once when `active` flips true. Cleans itself up.
 */
export default function PalmConfetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const greens = ["#3B5241", "#4F6B57", "#6E7355", "#8A8E6F", "#BF9F63"];

    type Leaf = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rot: number;
      vr: number;
      size: number;
      color: string;
      sway: number;
      swaySpeed: number;
    };

    const N = 90;
    const leaves: Leaf[] = Array.from({ length: N }, () => {
      const fromLeft = Math.random() < 0.5;
      return {
        x: fromLeft ? W() * 0.15 : W() * 0.85,
        y: H() * 0.5,
        vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 6),
        vy: -(8 + Math.random() * 10),
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        size: 8 + Math.random() * 12,
        color: greens[(Math.random() * greens.length) | 0],
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.04,
      };
    });

    const drawLeaf = (l: Leaf) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.fillStyle = l.color;
      ctx.globalAlpha = 0.92;
      // simple frond: pointed ellipse with a midrib
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size * 0.42, l.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -l.size);
      ctx.lineTo(0, l.size);
      ctx.stroke();
      ctx.restore();
    };

    let frame = 0;
    let raf = 0;
    const gravity = 0.28;
    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, W(), H());
      let alive = false;
      for (const l of leaves) {
        l.vy += gravity;
        l.sway += l.swaySpeed;
        l.x += l.vx + Math.sin(l.sway) * 1.6;
        l.y += l.vy;
        l.vx *= 0.99;
        l.rot += l.vr;
        if (l.y < H() + 40) alive = true;
        drawLeaf(l);
      }
      if (alive && frame < 420) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W(), H());
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, W(), H());
    };
  }, [active, reduced]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9995]"
      aria-hidden
    />
  );
}
