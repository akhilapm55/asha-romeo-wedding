"use client";

import { cn } from "@/lib/cn";

/* A single palm frond — used floating, in corners, and as confetti. */
export function PalmLeaf({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M60 198C60 198 58 120 58 90C58 55 66 20 60 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {Array.from({ length: 11 }).map((_, i) => {
        const t = i / 10;
        const y = 12 + t * 168;
        const len = 46 * (1 - Math.abs(t - 0.35)) + 14;
        return (
          <g key={i}>
            <path
              d={`M${58 - t * 2} ${y} C ${58 - len * 0.6} ${y - len * 0.5}, ${
                58 - len
              } ${y - len * 0.2}, ${58 - len} ${y + 4}`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity={0.9}
            />
            <path
              d={`M${58 + t * 2} ${y} C ${58 + len * 0.6} ${y - len * 0.5}, ${
                58 + len
              } ${y - len * 0.2}, ${58 + len} ${y + 4}`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* Soft watercolor wash blob — layered, blurred, low opacity backgrounds. */
export function WatercolorBlob({
  className,
  color = "var(--olive)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("blur-2xl", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill={color}
        opacity="0.4"
        d="M203 40c52-8 118 6 141 63 22 55-14 96-9 152 4 45-24 92-77 100-58 9-137-11-176-58-38-46-38-118-7-171 27-46 74-79 128-86Z"
      />
    </svg>
  );
}

/* Thin ornamental divider — gold botanical flourish between sections. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 24"
      className={cn("text-gold", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M2 12H90" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M150 12H238" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M120 3c-6 3-9 6-9 9s3 6 9 9c6-3 9-6 9-9s-3-6-9-9Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="120" cy="12" r="1.6" fill="currentColor" />
      <path d="M96 12c6-3 9-3 15 0-6 3-9 3-15 0Z" fill="currentColor" opacity="0.7" />
      <path d="M144 12c-6-3-9-3-15 0 6 3 9 3 15 0Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* A small hibiscus-ish bloom used in the Events section (flowers blooming). */
export function Bloom({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="30"
          rx="13"
          ry="22"
          fill="currentColor"
          opacity="0.85"
          transform={`rotate(${i * 72} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="var(--gold)" />
    </svg>
  );
}

/* Layered SVG waves for the hero ocean. */
export function OceanWaves({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="w1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ocean)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--ocean)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path fill="url(#w1)">
        <animate
          attributeName="d"
          dur="9s"
          repeatCount="indefinite"
          values="
            M0 90 Q 360 40 720 90 T 1440 90 V200 H0 Z;
            M0 90 Q 360 120 720 80 T 1440 100 V200 H0 Z;
            M0 90 Q 360 40 720 90 T 1440 90 V200 H0 Z"
        />
      </path>
      <path fill="var(--ocean)" fillOpacity="0.16">
        <animate
          attributeName="d"
          dur="7s"
          repeatCount="indefinite"
          values="
            M0 120 Q 360 90 720 130 T 1440 120 V200 H0 Z;
            M0 120 Q 360 150 720 110 T 1440 135 V200 H0 Z;
            M0 120 Q 360 90 720 130 T 1440 120 V200 H0 Z"
        />
      </path>
    </svg>
  );
}
