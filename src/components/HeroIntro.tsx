"use client";

import { motion, AnimatePresence } from "framer-motion";

type HeroIntroProps = {
  isDone: boolean;
};

export default function HeroIntro({ isDone }: HeroIntroProps) {
  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
          }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[#181c14]"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <RKLogo />
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.45,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[10px] uppercase tracking-[0.45em] text-[#ecdfcc]/65"
            >
              Portfolio Experience
            </motion.p>

            <ProgressLine />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RKLogo() {
  return (
    <motion.svg
      width="240"
      height="180"
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      className="overflow-visible"
    >
      {/* R - stem */}
      <motion.path
        d="M38 145V35"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0}
      />

      {/* R - top bowl */}
      <motion.path
        d="M38 35H86C108 35 122 48 122 68C122 88 108 101 86 101H38"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.18}
      />

      {/* R - diagonal leg */}
      <motion.path
        d="M86 101L128 145"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.36}
      />

      {/* K - stem */}
      <motion.path
        d="M160 145V35"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.5}
      />

      {/* K - upper arm (bredere og mer hero) */}
      <motion.path
        d="M160 90L205 35"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.66}
      />

      {/* K - lower arm */}
      <motion.path
        d="M160 90L218 145"
        stroke="#ecdfcc"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
        custom={0.82}
      />
    </motion.svg>
  );
}

const draw = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay,
        duration: 1.15,
        ease: [0.65, 0, 0.35, 1],
      },
      opacity: {
        delay,
        duration: 0.2,
      },
    },
  }),
};

function ProgressLine() {
  return (
    <div className="relative h-[1px] w-[180px] overflow-hidden bg-[#ecdfcc]/15">
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 h-full w-1/2 bg-[#ecdfcc]"
      />
    </div>
  );
}
