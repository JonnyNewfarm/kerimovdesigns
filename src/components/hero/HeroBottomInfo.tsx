"use client";

import { AnimatePresence, motion } from "framer-motion";

import LinkReveal from "../LinkReveal";
import LocalTime from "../LocalTime";
import TextReveal from "../TextReveal";
import TransitionLink from "../TransitionLink";

const BOTTOM_REVEAL_DELAYS = {
  time: 0.05,
  status: 0.17,
  latestProject: 0.29,
  portfolio: 0.41,
} as const;

const BOTTOM_REVEAL_DURATION = 0.75;
const BOTTOM_REVEAL_STAGGER = 0.025;
const BOTTOM_REVEAL_Y = "115%";
const BOTTOM_REVEAL_ROTATE = 1.5;

const infoVariants = {
  hidden: {
    opacity: 0,
    x: 12,
    filter: "blur(5px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",

    transition: {
      duration: 0.58,
      ease: [0.16, 1, 0.3, 1],
    },
  },
} as const;

export default function HeroBottomInfo({
  title,
  href,
  showWorld,
  isBottomInfoOpen,
  isBottomInfoClosing,
  openBottomInfo,
}: {
  title: string;
  href: string;
  showWorld: boolean;
  isBottomInfoOpen: boolean;
  isBottomInfoClosing: boolean;
  openBottomInfo: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: showWorld ? 1 : 0,
        y: showWorld ? 0 : 12,
        filter: showWorld ? "blur(0px)" : "blur(5px)",
      }}
      transition={{
        duration: 0.8,
        delay: showWorld ? 0.12 : 0,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="
        absolute
        bottom-6
        lg:bottom-10
        left-0
        right-0
        z-30
        px-10
        lg:px-20
      "
    >
      <div
        className="
          flex
          w-full
          items-end
          justify-between
        "
      >
        <motion.div
          initial={false}
          animate={{
            scale: isBottomInfoClosing || !isBottomInfoOpen ? 0.68 : 1,
          }}
          transition={{
            duration: isBottomInfoClosing || !isBottomInfoOpen ? 0.9 : 0.75,
            ease: [0.76, 0, 0.24, 1],
          }}
          style={{
            transformOrigin: "left bottom",
          }}
        >
          <TextReveal
            as="h1"
            mode="words"
            viewport={false}
            active={showWorld}
            delay={BOTTOM_REVEAL_DELAYS.portfolio}
            stagger={BOTTOM_REVEAL_STAGGER}
            duration={BOTTOM_REVEAL_DURATION}
            y={BOTTOM_REVEAL_Y}
            rotate={BOTTOM_REVEAL_ROTATE}
            className="
              satoshi-black
              hidden
              whitespace-nowrap
              leading-[0.95]
              tracking-[-0.02em]
              text-color
              lg:block
              lg:text-4xl
            "
          >
            Portfolio / 2026
          </TextReveal>
        </motion.div>

        <div
          className="
            relative
            flex
            flex-1
            items-end
            justify-end
          "
        >
          {/* MOBILE */}
          <div
            className="
              flex
              items-center
              gap-x-1
              whitespace-nowrap
              text-[12px]
              lg:hidden
            "
          >
            <span className="satoshi-black text-color">Latest Project</span>

            <span>/</span>

            <TransitionLink
              href={`/project/${href}`}
              transitionLabel={title}
              className="
                group
                relative
                w-fit
                whitespace-nowrap
              "
            >
              <span>{title}</span>

              <span
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-full
                  overflow-hidden
                "
              >
                <span
                  className="
                    absolute
                    inset-0
                    origin-right
                    scale-x-100
                    bg-current
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.76,0,0.24,1)]
                    group-hover:scale-x-0
                  "
                />

                <span
                  className="
                    absolute
                    inset-0
                    origin-left
                    scale-x-0
                    bg-current
                    transition-transform
                    duration-500
                    delay-0
                    ease-[cubic-bezier(0.76,0,0.24,1)]
                    group-hover:scale-x-100
                    group-hover:delay-[180ms]
                  "
                />
              </span>
            </TransitionLink>
          </div>

          {/* DESKTOP */}
          <div className="hidden flex-1 lg:block">
            <AnimatePresence initial={false} mode="wait">
              {isBottomInfoOpen ? (
                <motion.div
                  key="bottom-info"
                  initial="hidden"
                  animate={isBottomInfoClosing ? "exit" : "visible"}
                  exit={{
                    opacity: 0,

                    transition: {
                      duration: 0.01,
                    },
                  }}
                  variants={{
                    hidden: {},

                    visible: {
                      transition: {
                        staggerChildren: 0.085,
                      },
                    },

                    exit: {
                      transition: {
                        delayChildren: 0.7,
                        staggerChildren: 0.1,
                        staggerDirection: -1,
                      },
                    },
                  }}
                  className="
                    flex
                    flex-1
                    items-end
                    justify-between
                    pl-20
                  "
                >
                  {/* LATEST PROJECT */}
                  <motion.div
                    variants={{
                      ...infoVariants,

                      exit: {
                        opacity: 0,
                        x: 46,
                        scale: 0.975,
                        filter: "blur(6px)",

                        transition: {
                          x: {
                            duration: 0.72,
                            ease: [0.16, 1, 0.3, 1],
                          },

                          opacity: {
                            duration: 0.52,
                            ease: "easeOut",
                          },

                          scale: {
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                          },

                          filter: {
                            duration: 0.58,
                            ease: "easeOut",
                          },
                        },
                      },
                    }}
                  >
                    <LinkReveal
                      active={showWorld}
                      delay={BOTTOM_REVEAL_DELAYS.latestProject}
                      duration={BOTTOM_REVEAL_DURATION}
                      y={BOTTOM_REVEAL_Y}
                      rotate={BOTTOM_REVEAL_ROTATE}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-x-1
                          whitespace-nowrap
                          text-[14px]
                        "
                      >
                        <span className="satoshi-black text-color">
                          Latest Project
                        </span>

                        <span>/</span>

                        <TransitionLink
                          href={`/project/${href}`}
                          transitionLabel={title}
                          className="
                            group
                            relative
                            w-fit
                            whitespace-nowrap
                          "
                        >
                          <span>{title}</span>

                          <span
                            className="
                              pointer-events-none
                              absolute
                              bottom-0
                              left-0
                              h-px
                              w-full
                              overflow-hidden
                            "
                          >
                            <span
                              className="
                                absolute
                                inset-0
                                origin-right
                                scale-x-100
                                bg-current
                                transition-transform
                                duration-500
                                ease-[cubic-bezier(0.76,0,0.24,1)]
                                group-hover:scale-x-0
                              "
                            />

                            <span
                              className="
                                absolute
                                inset-0
                                origin-left
                                scale-x-0
                                bg-current
                                transition-transform
                                duration-500
                                delay-0
                                ease-[cubic-bezier(0.76,0,0.24,1)]
                                group-hover:scale-x-100
                                group-hover:delay-[180ms]
                              "
                            />
                          </span>
                        </TransitionLink>
                      </div>
                    </LinkReveal>
                  </motion.div>

                  {/* STATUS - ONLY XL AND UP */}
                  <motion.div
                    className="hidden xl:block"
                    variants={{
                      ...infoVariants,

                      exit: {
                        opacity: 0,
                        x: 52,
                        scale: 0.975,
                        filter: "blur(6px)",

                        transition: {
                          x: {
                            duration: 0.72,
                            ease: [0.16, 1, 0.3, 1],
                          },

                          opacity: {
                            duration: 0.52,
                            ease: "easeOut",
                          },

                          scale: {
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                          },

                          filter: {
                            duration: 0.58,
                            ease: "easeOut",
                          },
                        },
                      },
                    }}
                  >
                    <TextReveal
                      as="p"
                      mode="words"
                      viewport={false}
                      active={showWorld}
                      delay={BOTTOM_REVEAL_DELAYS.status}
                      stagger={BOTTOM_REVEAL_STAGGER}
                      duration={BOTTOM_REVEAL_DURATION}
                      y={BOTTOM_REVEAL_Y}
                      rotate={BOTTOM_REVEAL_ROTATE}
                      className="
                        satoshi-black
                        whitespace-nowrap
                        text-[14px]
                        text-color
                      "
                    >
                      Status / Open for work
                    </TextReveal>
                  </motion.div>

                  {/* LOCAL TIME */}
                  <motion.div
                    variants={{
                      ...infoVariants,

                      exit: {
                        opacity: 0,
                        x: 58,
                        scale: 0.975,
                        filter: "blur(6px)",

                        transition: {
                          x: {
                            duration: 0.72,
                            ease: [0.16, 1, 0.3, 1],
                          },

                          opacity: {
                            duration: 0.52,
                            ease: "easeOut",
                          },

                          scale: {
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                          },

                          filter: {
                            duration: 0.58,
                            ease: "easeOut",
                          },
                        },
                      },
                    }}
                  >
                    <LinkReveal
                      active={showWorld}
                      delay={BOTTOM_REVEAL_DELAYS.time}
                      duration={BOTTOM_REVEAL_DURATION}
                      y={BOTTOM_REVEAL_Y}
                      rotate={BOTTOM_REVEAL_ROTATE}
                    >
                      <p
                        className="
                          satoshi-black
                          whitespace-nowrap
                          text-[14px]
                          text-color
                        "
                      >
                        <LocalTime />
                      </p>
                    </LinkReveal>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.button
                  key="open-info"
                  type="button"
                  onClick={openBottomInfo}
                  initial={{
                    opacity: 0,
                    x: -12,
                    filter: "blur(6px)",
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    x: 12,
                    filter: "blur(5px)",
                  }}
                  transition={{
                    duration: 0.24,
                    delay: 0,
                    ease: [0.12, 1, 0.2, 1],
                  }}
                  className="
                    satoshi-black
                    absolute
                    bottom-0
                    right-0
                    cursor-pointer
                    whitespace-nowrap
                    uppercase
                    text-color
                    text-[14px]
                  "
                >
                  Open info
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
