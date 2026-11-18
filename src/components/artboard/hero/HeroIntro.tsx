"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

type Props = {
  visible: boolean;
};

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.35,
      ease,
    },
  },
};

const lineVariants: Variants = {
  hidden: {
    y: "105%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 1.05,
      ease,
    },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export default function HeroIntro({ visible }: Props) {
  const reducedMotion = useReducedMotion() ?? false;

  const variants = reducedMotion ? reducedVariants : lineVariants;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hero-intro"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[20]
            flex
            items-center
            justify-start
            text-color
          "
        >
          <div
            className="
              ml-[5%]
              flex
              flex-col
              items-start
              text-left
              lg:ml-[3.1%]
            "
          >
            <div className="overflow-hidden">
              <motion.p
                variants={variants}
                className="
                  text-[clamp(19px,2.8vw,36px)]
                  font-medium
                  leading-[1.2]
                  tracking-normal
                  will-change-transform
                "
              >
                Creative Direction
              </motion.p>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                variants={variants}
                className="
                  text-[clamp(19px,2.8vw,36px)]
                  font-black
                  leading-[1.2]
                  tracking-normal
                  will-change-transform
                "
              >
                Portfolio (2024–2026)
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
