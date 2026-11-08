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
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08,
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
  stagger = 0.045,
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

export default function HeroIntro({ visible }: Props) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hero-intro"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="pointer-events-none absolute inset-0 z-[20] text-color"
        >
          {/* LEFT HERO HEADING */}
          <motion.div
            className="
              absolute
              left-[5%]
              top-[105px]
              w-[90%]
              lg:left-[3.1%]
              lg:top-[32%]
              lg:w-[70%]
            "
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            <h1
              className="
                text-[clamp(22px,4.2vw,32px)]
                font-bold
                leading-[1.1]
                tracking-[-0.035em]
                lg:text-[clamp(25px,2.15vw,38px)]
              "
            >
              <div className="lg:whitespace-nowrap">
                <RevealWords
                  text="GRAPHIC DESIGNER"
                  stagger={0.06}
                  reducedMotion={reducedMotion}
                />
              </div>

              <div className="lg:whitespace-nowrap">
                <RevealWords
                  text="CRAFTING VISUAL IDENTITIES,"
                  stagger={0.045}
                  reducedMotion={reducedMotion}
                />
              </div>

              <div className="lg:whitespace-nowrap">
                <RevealWords
                  text="TYPOGRAPHY AND MOTION."
                  stagger={0.045}
                  reducedMotion={reducedMotion}
                />
              </div>
            </h1>
          </motion.div>

          {/* RIGHT PORTRAIT AND DESCRIPTION */}
          <motion.div
            className="
              absolute
              right-[5%]
              top-[225px]
              w-[clamp(104px,28vw,140px)]
              lg:bottom-0
              lg:right-[3.1%]
              lg:top-0
              lg:w-[clamp(150px,12vw,210px)]
            "
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: reducedMotion ? 0 : 0.4,
                },
              },
            }}
          >
            {/* PORTRAIT SPACE */}
            <div
              className="
                aspect-[4/5]
                lg:absolute
                lg:left-0
                lg:top-[150px]
                lg:w-full
              "
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
