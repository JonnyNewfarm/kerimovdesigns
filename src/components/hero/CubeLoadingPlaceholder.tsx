"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type CubeLoadingPlaceholderProps = {
  visible: boolean;
};

export default function CubeLoadingPlaceholder({
  visible,
}: CubeLoadingPlaceholderProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
      }}
      transition={{
        duration: 0.4,
        ease,
      }}
      className="
        pointer-events-none
        absolute
        inset-0
        z-[5]
        flex
        items-center
        justify-center
      "
      aria-hidden={!visible}
    >
      <div className="flex flex-col items-center gap-y-5">
        <div
          className="
            relative
            h-[75vw]
            w-[75vw]
            max-h-[360px]
            max-w-[360px]

            sm:h-[40vw]
            sm:w-[40vw]

            md:h-[280px]
            md:w-[280px]

            xl:h-[310px]
            xl:w-[310px]
          "
        >
          <div className="absolute inset-0 border border-[#ecdfcc]/10" />

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <motion.rect
              x="0.25"
              y="0.25"
              width="99.5"
              height="99.5"
              fill="none"
              stroke="#ecdfcc"
              strokeOpacity="0.55"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              pathLength="100"
              strokeDasharray="94 6"
              animate={
                visible
                  ? {
                      strokeDashoffset: [0, -100],
                    }
                  : undefined
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        </div>

        <div className="flex w-full justify-between">
          <p
            className="
              satoshi-black
              text-[10px]
              uppercase
              tracking-[-0.02em]
              text-[#ecdfcc]/80
            "
          >
            Preparing cube
          </p>
        </div>
      </div>
    </motion.div>
  );
}
