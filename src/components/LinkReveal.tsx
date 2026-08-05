"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const defaultEase = [0.22, 1, 0.36, 1] as const;

type LinkRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: string | number;
  rotate?: number;
  blur?: number;
  active?: boolean;
};

export default function LinkReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  y = "115%",
  rotate = 1.5,
  blur = 0,
  active = true,
}: LinkRevealProps) {
  const variants: Variants = {
    hidden: {
      y,
      opacity: 0,
      rotate,
      ...(blur > 0 ? { filter: `blur(${blur}px)` } : {}),
    },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      ...(blur > 0 ? { filter: "blur(0px)" } : {}),
      transition: {
        delay,
        duration,
        ease: defaultEase,
      },
    },
  };

  return (
    <span className={`inline-block overflow-hidden align-top ${className}`}>
      <motion.span
        variants={variants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}
