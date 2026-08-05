"use client";

import { motion, type Variants } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const defaultEase = [0.22, 1, 0.36, 1] as const;

type ButtonRevealProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  contentClassName?: string;
  delay?: number;
  duration?: number;
  y?: string | number;
  rotate?: number;
  blur?: number;
  active?: boolean;
};

export default function ButtonReveal({
  children,
  className = "",
  contentClassName = "",
  delay = 0,
  duration = 0.75,
  y = "115%",
  rotate = 1.5,
  blur = 0,
  active = true,
  type = "button",
  disabled,
  ...buttonProps
}: ButtonRevealProps) {
  const variants: Variants = {
    hidden: {
      y,
      opacity: 0,
      rotate,
      ...(blur > 0
        ? {
            filter: `blur(${blur}px)`,
          }
        : {}),
    },

    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      ...(blur > 0
        ? {
            filter: "blur(0px)",
          }
        : {}),
      transition: {
        delay,
        duration,
        ease: defaultEase,
      },
    },
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={className}
      {...buttonProps}
    >
      <span className="inline-block overflow-hidden align-top">
        <motion.span
          variants={variants}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          className={`inline-flex items-center ${contentClassName}`}
        >
          {children}
        </motion.span>
      </span>
    </motion.button>
  );
}
