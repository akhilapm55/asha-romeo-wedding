"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { sections, couple } from "@/lib/content";
import { scrollToTarget } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToTarget(`#${id}`, { offset: -10 });
  };

  return (
    <>
      {/* scroll progress line */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-olive via-gold to-palm"
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe",
          solid
            ? "bg-ivory/80 backdrop-blur-md shadow-[0_6px_30px_-24px_rgba(48,44,36,0.9)]"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-editorial items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          <button
            onClick={() => go("hero")}
            className="font-serif text-lg tracking-wide text-palm sm:text-xl"
            aria-label="Back to top"
          >
            {couple.bride.first[0]} <span className="text-gold">+</span>{" "}
            {couple.groom.first[0]}
          </button>

          {/* desktop links */}
          <nav className="hidden items-center gap-7 lg:flex">
            {sections
              .filter((s) => s.id !== "hero")
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => go(s.id)}
                  className="link-underline font-sans text-[0.72rem] uppercase tracking-wide2 text-ink-soft hover:text-palm"
                >
                  {s.label}
                </button>
              ))}
          </nav>

          <button
            onClick={() => go("rsvp")}
            className="hidden rounded-full bg-palm px-5 py-2 font-sans text-[0.7rem] uppercase tracking-wide2 text-ivory transition hover:bg-palm-dark lg:inline-block"
          >
            RSVP
          </button>

          {/* mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-palm lg:hidden"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ivory/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-1">
              {sections.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(s.id)}
                  className="font-serif text-3xl text-palm"
                >
                  {s.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
