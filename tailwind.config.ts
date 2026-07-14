import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette — soft, muted, editorial. No bright colors.
        ivory: {
          DEFAULT: "#FCFCFA",
          deep: "#F1F0EA",
          warm: "#F8F7F1",
        },
        sand: {
          DEFAULT: "#E7D8BE",
          light: "#EFE4CF",
          dark: "#D8C3A0",
        },
        olive: {
          DEFAULT: "#6E7355",
          light: "#8A8E6F",
          dark: "#565B41",
        },
        palm: {
          DEFAULT: "#3B5241",
          light: "#4F6B57",
          dark: "#2A3D30",
        },
        // "gold" token is repurposed as the muted sage/olive accent (no gold in
        // the stationery) — cascades to every existing accent, line and chip.
        gold: {
          DEFAULT: "#7E8768",
          light: "#AAB392",
          dark: "#5F6A4C",
        },
        terracotta: {
          DEFAULT: "#C07B58",
          light: "#D0987A",
          dark: "#A5623F",
        },
        ocean: {
          DEFAULT: "#6E8B9B",
          light: "#93AAB7",
          dark: "#537180",
        },
        ink: {
          DEFAULT: "#302C24",
          soft: "#4A4438",
          faint: "#7A7365",
        },
      },
      fontFamily: {
        // "serif" is repurposed as the light display sans (headings/wordmark)
        // to keep the many existing `font-serif` usages working after the
        // re-theme to the save-the-date's minimal sans identity.
        serif: ["var(--font-sans)", "Montserrat", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Montserrat", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wide2: "0.16em",
      },
      maxWidth: {
        editorial: "78rem",
      },
      keyframes: {
        "wave-slide": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-dance": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "wave-slide": "wave-slide 18s linear infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "border-dance": "border-dance 6s ease infinite",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
