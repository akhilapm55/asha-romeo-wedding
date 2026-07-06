"use client";

import {
  motion,
  useInView,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---- Simple in-view fade/slide (used sparingly; not the only effect) ---- */
export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
  once = true,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  once?: boolean;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ---- Clip-path reveal (image / block wipes open) ---- */
export function ClipReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const from =
    direction === "up"
      ? "inset(100% 0% 0% 0%)"
      : direction === "left"
      ? "inset(0% 100% 0% 0%)"
      : "inset(0% 0% 0% 100%)";
  return (
    <motion.div
      initial={{ clipPath: from, opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---- Word-by-word line reveal (split text without a plugin) ---- */
const wordContainer: Variants = {
  hidden: {},
  show: (stagger: number = 0.045) => ({
    transition: { staggerChildren: stagger },
  }),
};
const wordChild: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

export function SplitWords({
  text,
  className,
  wordClassName,
  stagger = 0.045,
  once = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-12% 0px" });
  return (
    <span ref={ref} className={cn("inline", className)}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={wordChild}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={stagger}
            transition={{ delay: i * stagger }}
          >
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---- Staggered list container ---- */
export function Stagger({
  children,
  className,
  stagger = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
