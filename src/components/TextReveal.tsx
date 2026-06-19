"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const defaultEase = [0.22, 1, 0.36, 1] as const;

type TextRevealProps = {
  children: React.ReactNode;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "label" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  mode?: "words" | "lines" | "chars";
  y?: string | number;
  rotate?: number;
  blur?: number;
  viewport?: boolean;
  htmlFor?: string;
};

export default function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  stagger,
  duration,
  once = true,
  amount = 0.35,
  mode = "words",
  y = "115%",
  rotate,
  blur = 10,
  viewport = true,
  htmlFor,
}: TextRevealProps) {
  const MotionTag = motion[as] as any;

  const text = React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      return "";
    })
    .join("");

  const items =
    mode === "lines"
      ? text.split("\n").filter((line) => line.trim().length > 0)
      : mode === "chars"
        ? Array.from(text)
        : text.split(" ");

  const resolvedStagger =
    stagger ?? (mode === "lines" ? 0.11 : mode === "chars" ? 0.014 : 0.028);

  const resolvedDuration =
    duration ?? (mode === "lines" ? 1 : mode === "chars" ? 0.55 : 0.75);

  const resolvedRotate =
    rotate ?? (mode === "lines" ? 2.5 : mode === "chars" ? 0 : 1.5);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: resolvedStagger,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y,
      opacity: 0,
      rotate: resolvedRotate,
      filter: `blur(${blur}px)`,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: resolvedDuration,
        ease: defaultEase,
      },
    },
  };

  return (
    <MotionTag
      htmlFor={as === "label" ? htmlFor : undefined}
      variants={containerVariants}
      initial="hidden"
      whileInView={viewport ? "visible" : undefined}
      animate={!viewport ? "visible" : undefined}
      viewport={viewport ? { once, amount } : undefined}
      className={className}
    >
      {items.map((item, index) => {
        const isSpaceChar = mode === "chars" && item === " ";

        return (
          <span
            key={`${item}-${index}`}
            className={
              mode === "lines"
                ? "block overflow-hidden"
                : "inline-block overflow-hidden align-top"
            }
          >
            <motion.span
              variants={itemVariants}
              className="inline-block will-change-transform"
            >
              {isSpaceChar ? "\u00A0" : item}

              {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
