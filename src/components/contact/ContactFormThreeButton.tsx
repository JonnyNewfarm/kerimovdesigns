"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ContactFormThreeButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
};

const BUTTON_EASE = [0.22, 1, 0.36, 1] as const;

export default function ContactFormThreeButton({
  children,
  type = "submit",
  disabled = false,
}: ContactFormThreeButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={
        disabled
          ? undefined
          : {
              x: 3,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.985,
            }
      }
      transition={{
        duration: 0.35,
        ease: BUTTON_EASE,
      }}
      className={`
        group

        relative

        flex
        min-h-[46px]
        items-center
        justify-center

        overflow-hidden

        bg-[#20241e]

        px-5
        py-3

        font-bueno
        text-[11px]
        font-black
        uppercase
        tracking-[0.08em]

        text-[#ecdfcc]

        transition-colors
        duration-500

        sm:min-h-[48px]
        sm:px-6
        sm:text-[12px]

        ${
          disabled
            ? `
              cursor-not-allowed
              opacity-35
            `
            : `
              cursor-pointer
              hover:bg-[#171a15]
            `
        }
      `}
    >
      <span
        className="
          pointer-events-none

          absolute
          inset-0

          origin-bottom
          scale-y-0

          bg-[#131611]

          transition-transform
          duration-500

          ease-[cubic-bezier(0.76,0,0.24,1)]

          group-hover:scale-y-100
        "
      />

      <span
        className="
          pointer-events-none
          relative
          z-10

          whitespace-nowrap
        "
      >
        {children}
      </span>
    </motion.button>
  );
}
