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

const INTRO_TEXT =
  "Take a look at my selected projects below to see what I've been working on. I'm always open to new projects, fresh ideas and creative collaborations, so feel free to get in touch.";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      delayChildren: 0.48,
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

const wordVariants: Variants = {
  hidden: {
    y: "115%",
    opacity: 0,
    filter: "blur(3px)",
  },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease,
    },
  },
};

function RevealWords({
  text,
  stagger = 0.018,
  reducedMotion,
}: {
  text: string;
  stagger?: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.span
      className="block"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : stagger,
          },
        },
      }}
    >
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mr-[0.24em] inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={
              reducedMotion
                ? {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }
                : wordVariants
            }
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default function ProjectIntro({ visible }: Props) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="project-intro"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[20]
            text-color
          "
        >
          <div
            className="
              absolute
              right-[5%]
              top-[225px]
              w-[clamp(104px,28vw,140px)]

              lg:top-auto
              lg:bottom-[calc(21svh+32px)]
              lg:right-[3.1%]
              lg:w-[clamp(150px,12vw,210px)]

              [@media(min-width:1024px)_and_(max-height:680px)]:hidden
            "
          >
            {/* Preserve the original mobile layout */}
            <div className="aspect-[4/5] lg:hidden" />

            <div
              className="
                mt-7
                w-[min(62vw,290px)]
                -translate-x-[50%]

                lg:absolute
                lg:bottom-0
                lg:left-0
                lg:mt-0
                lg:w-[clamp(360px,29vw,500px)]
                lg:-translate-x-[55%]
              "
            >
              <p
                className="
                  text-[14px]
                  leading-[1.45]
                  tracking-[-0.025em]
                  text-color
                  lg:text-[17px]
                "
              >
                <RevealWords
                  text={INTRO_TEXT}
                  stagger={0.018}
                  reducedMotion={reducedMotion}
                />
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
