"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { useIsDesktop } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  strength?: number;
  external?: boolean;
  type?: "button" | "submit";
};

/** Button/link with magnetic pull toward the cursor + gold ripple on click. */
export default function MagneticButton({
  children,
  href,
  onClick,
  className,
  variant = "solid",
  strength = 0.35,
  external,
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const desktop = useIsDesktop();

  const move = (e: MouseEvent) => {
    if (!desktop || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const ripple = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const circle = document.createElement("span");
    const d = Math.max(el.clientWidth, el.clientHeight);
    const r = el.getBoundingClientRect();
    circle.style.cssText = `position:absolute;border-radius:9999px;pointer-events:none;width:${d}px;height:${d}px;left:${
      e.clientX - r.left - d / 2
    }px;top:${
      e.clientY - r.top - d / 2
    }px;background:rgba(191,159,99,0.35);transform:scale(0);opacity:1;transition:transform .6s ease,opacity .8s ease;`;
    el.appendChild(circle);
    requestAnimationFrame(() => {
      circle.style.transform = "scale(2.4)";
      circle.style.opacity = "0";
    });
    setTimeout(() => circle.remove(), 800);
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[0.82rem] font-sans uppercase tracking-wide2 transition-[background,color,box-shadow] duration-500 ease-luxe will-change-transform";
  const variants = {
    solid:
      "bg-palm text-ivory hover:bg-palm-dark shadow-[0_16px_40px_-18px_rgba(59,82,65,0.8)]",
    outline:
      "border border-gold/60 text-palm hover:bg-gold/10 hover:border-gold",
    ghost: "text-palm hover:text-gold-dark",
  } as const;

  const cls = cn(base, variants[variant], className);
  const handleClick = (e: MouseEvent) => {
    ripple(e);
    onClick?.();
  };

  if (href) {
    return (
      <a
        ref={ref as any}
        href={href}
        onMouseMove={move}
        onMouseLeave={reset}
        onClick={handleClick}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as any}
      type={type}
      onMouseMove={move}
      onMouseLeave={reset}
      onClick={handleClick}
      className={cls}
    >
      {children}
    </button>
  );
}
