"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
] as const;

const STEP_DURATION = 520;
const START_DELAY = 520;

const CUBE_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export default function HeroIntro({ isDone, onExitComplete }: HeroIntroProps) {
  const cubeRef = useRef<HTMLDivElement | null>(null);

  const [cubeFinished, setCubeFinished] = useState(false);

  useEffect(() => {
    const cube = cubeRef.current;

    if (!cube) {
      return;
    }

    let cancelled = false;
    let currentAnimation: Animation | null = null;

    const wait = (duration: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, duration);
      });

    const waitForPaint = () =>
      new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            resolve();
          });
        });
      });

    const runSequence = async () => {
      setCubeFinished(false);

      /*
       * Alltid start helt eksakt på 00.
       */
      cube.style.transform = cubeTransforms[0];

      await wait(START_DELAY);

      if (cancelled) {
        return;
      }

      /*
       * 00 -> 019
       * 019 -> 045
       * 045 -> 072
       * 072 -> 100
       *
       * Neste steg eksisterer ikke før
       * currentAnimation.finished har resolved.
       */
      for (let index = 1; index < cubeTransforms.length; index += 1) {
        if (cancelled) {
          return;
        }

        const from = cubeTransforms[index - 1];
        const to = cubeTransforms[index];

        currentAnimation = cube.animate(
          [
            {
              transform: from,
            },
            {
              transform: to,
            },
          ],
          {
            duration: STEP_DURATION,
            easing: CUBE_EASING,
            fill: "forwards",
          },
        );

        try {
          await currentAnimation.finished;
        } catch {
          return;
        }

        if (cancelled) {
          return;
        }

        /*
         * Commit sluttposisjonen til selve elementet.
         * Dermed er vi ikke avhengige av animation fill
         * når neste steg begynner.
         */
        cube.style.transform = to;

        currentAnimation.cancel();
        currentAnimation = null;

        /*
         * La browseren faktisk tegne ferdig siden
         * før neste rotasjon får starte.
         */
        await waitForPaint();

        if (cancelled) {
          return;
        }
      }

      setCubeFinished(true);
    };

    void runSequence();

    return () => {
      cancelled = true;

      if (currentAnimation) {
        currentAnimation.cancel();
      }
    };
  }, []);

  /*
   * Introen går først ut når:
   *
   * 1. siden er ferdig
   * 2. 100-steget fysisk er ferdig
   */
  const shouldExit = isDone && cubeFinished;

  return (
    <motion.div
      initial={{
        y: "0%",
      }}
      animate={
        shouldExit
          ? {
              y: "-100%",
            }
          : {
              y: "0%",
            }
      }
      transition={{
        delay: shouldExit ? 0.45 : 0,
        duration: shouldExit ? 0.95 : 0,
        ease,
      }}
      onAnimationComplete={() => {
        if (!shouldExit) {
          return;
        }

        onExitComplete?.();
      }}
      className="fixed inset-0 z-[999] bg-[#181c14]"
      style={{
        pointerEvents: shouldExit ? "none" : "auto",
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
              <div
                ref={cubeRef}
                className="relative h-full w-full"
                style={{
                  transform: cubeTransforms[0],
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
              </div>
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
  children: React.ReactNode;
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
      }}
    >
      {children}
    </div>
  );
}
