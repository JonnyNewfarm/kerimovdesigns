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
        min-h-[48px]
        min-w-[168px]
        items-center
        justify-center

        overflow-hidden

        bg-[#11130f]

        px-6
        py-3

        font-bueno
        text-[11px]
        font-black
        uppercase
        tracking-[0.095em]

        text-[#f0eadf]

        sm:min-h-[50px]
        sm:min-w-[178px]
        sm:px-7
        sm:text-[12px]

        ${
          disabled
            ? `
              cursor-not-allowed
              opacity-35
            `
            : `
              cursor-pointer
            `
        }
      `}
    >
      <span
        className="
          pointer-events-none
          relative
          z-10

          block
          h-[1.05em]

          overflow-hidden

          whitespace-nowrap
          leading-none
        "
      >
        <span
          className="
            block

            translate-y-0

            transition-transform
            duration-[550ms]

            ease-[cubic-bezier(0.76,0,0.24,1)]

            group-hover:-translate-y-full
          "
        >
          {children}
        </span>

        <span
          aria-hidden="true"
          className="
            absolute
            left-0
            top-full

            block

            transition-transform
            duration-[550ms]

            ease-[cubic-bezier(0.76,0,0.24,1)]

            group-hover:-translate-y-full
          "
        >
          {children}
        </span>
      </span>
    </motion.button>
  );
}
