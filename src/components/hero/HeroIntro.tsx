"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type HeroIntroProps = {
  isDone: boolean;
  onExitComplete?: () => void;
};

const ease = [0.76, 0, 0.24, 1] as const;

const cubeTransforms = [
  "rotateX(0deg) rotateY(0deg)",
  "rotateX(0deg) rotateY(-90deg)",
  "rotateX(0deg) rotateY(-180deg)",
  "rotateX(0deg) rotateY(-270deg)",
  "rotateX(-90deg) rotateY(-270deg)",
];

export default function HeroIntro({ isDone, onExitComplete }: HeroIntroProps) {
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);

  useEffect(() => {
    if (isDone) {
      return;
    }

    let cancelled = false;

    let frame1 = 0;
    let frame2 = 0;

    const timers: number[] = [];

    const startAnimation = () => {
      if (cancelled) {
        return;
      }

      setActiveFaceIndex(0);

      timers.push(
        window.setTimeout(() => {
          if (!cancelled) {
            setActiveFaceIndex(1);
          }
        }, 520),

        window.setTimeout(() => {
          if (!cancelled) {
            setActiveFaceIndex(2);
          }
        }, 1040),

        window.setTimeout(() => {
          if (!cancelled) {
            setActiveFaceIndex(3);
          }
        }, 1560),

        window.setTimeout(() => {
          if (!cancelled) {
            setActiveFaceIndex(4);
          }
        }, 2080),
      );
    };

    const prepareAnimation = async () => {
      /*
       * Vent til fonts er klare.
       * Dette hindrer font/layout-work samtidig som kuben starter.
       */
      try {
        await document.fonts?.ready;
      } catch {
        // Ignorer hvis browseren ikke støtter dette ordentlig.
      }

      if (cancelled) {
        return;
      }

      /*
       * Første RAF:
       * React/layout får sette seg.
       */
      frame1 = window.requestAnimationFrame(() => {
        /*
         * Andre RAF:
         * browseren har fått faktisk paintet loaderen.
         */
        frame2 = window.requestAnimationFrame(() => {
          startAnimation();
        });
      });
    };

    void prepareAnimation();

    return () => {
      cancelled = true;

      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);

      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [isDone]);

  return (
    <motion.div
      initial={{
        y: "0%",
      }}
      animate={
        isDone
          ? {
              y: "-100%",
            }
          : {
              y: "0%",
            }
      }
      transition={{
        delay: isDone ? 0.45 : 0,
        duration: isDone ? 0.95 : 0,
        ease,
      }}
      onAnimationComplete={() => {
        if (!isDone) {
          return;
        }

        onExitComplete?.();
      }}
      className="fixed inset-0 z-[999] bg-[#181c14]"
      style={{
        pointerEvents: isDone ? "none" : "auto",
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.65,
              ease,
            }}
            className="flex flex-col gap-4"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.42em] text-[#ecdfcc]/55">
              Loading
            </div>

            <div
              className="
                h-[92px]
                w-[92px]
                perspective-[800px]
                [--cube-depth:46px]

                md:h-[118px]
                md:w-[118px]
                md:[--cube-depth:59px]
              "
            >
              <motion.div
                animate={{
                  transform: cubeTransforms[activeFaceIndex],
                }}
                transition={{
                  duration: 0.62,
                  ease,
                }}
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                }}
              >
                <CubeFace transform="translateZ(var(--cube-depth))">
                  00
                </CubeFace>

                <CubeFace transform="rotateY(90deg) translateZ(var(--cube-depth))">
                  019
                </CubeFace>

                <CubeFace transform="rotateY(180deg) translateZ(var(--cube-depth))">
                  045
                </CubeFace>

                <CubeFace transform="rotateY(270deg) translateZ(var(--cube-depth))">
                  072
                </CubeFace>

                <CubeFace transform="rotateY(270deg) rotateX(90deg) translateZ(var(--cube-depth))">
                  100
                </CubeFace>

                <CubeFace
                  muted
                  transform="rotateY(270deg) rotateX(-90deg) translateZ(var(--cube-depth))"
                >
                  %
                </CubeFace>
              </motion.div>
            </div>

            <div className="h-px w-[160px] overflow-hidden bg-[#ecdfcc]/20 md:w-[210px]">
              <motion.div
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 2.65,
                  ease,
                }}
                className="h-full w-full origin-left bg-[#ecdfcc]/70"
                style={{
                  willChange: "transform",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function CubeFace({
  children,
  transform,
  muted = false,
}: {
  children: ReactNode;
  transform: string;
  muted?: boolean;
}) {
  return (
    <div
      className={[
        "absolute inset-0 flex items-center justify-center border bg-[#181c14]",
        "text-4xl font-black tracking-[-0.035em] md:text-5xl",
        muted
          ? "border-[#ecdfcc]/25 text-[#ecdfcc]/25"
          : "border-[#ecdfcc]/65 text-[#ecdfcc]",
      ].join(" ")}
      style={{
        transform,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {children}
    </div>
  );
}
