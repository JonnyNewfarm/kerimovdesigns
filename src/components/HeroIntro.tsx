"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    if (isDone) return;

    setActiveFaceIndex(0);

    const timers = [
      window.setTimeout(() => setActiveFaceIndex(1), 520),
      window.setTimeout(() => setActiveFaceIndex(2), 1040),
      window.setTimeout(() => setActiveFaceIndex(3), 1560),
      window.setTimeout(() => setActiveFaceIndex(4), 2080),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isDone]);

  return (
    <motion.div
      initial={{ y: "0%" }}
      animate={isDone ? { y: "-100%" } : { y: "0%" }}
      transition={{
        delay: isDone ? 0.45 : 0,
        duration: isDone ? 0.95 : 0,
        ease,
      }}
      className="absolute inset-0 z-50 bg-[#181c14]"
      style={{
        pointerEvents: isDone ? "none" : "auto",
      }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute left-6 top-6 text-[10px] font-black uppercase tracking-[0.45em] text-[#ecdfcc]/55 md:left-10 md:top-10"
        >
          Portfolio Experience
        </motion.p>

        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.65,
              ease,
            }}
            className="flex flex-col gap-4"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.42em] text-[#ecdfcc]/55">
              Loading
            </div>

            <div className="h-[92px] w-[92px] perspective-[800px] [--cube-depth:46px] md:h-[118px] md:w-[118px] md:[--cube-depth:59px]">
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
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 2.65,
                  ease,
                }}
                className="h-full w-full origin-left bg-[#ecdfcc]/70"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.25,
            ease,
          }}
          className="absolute bottom-8 right-8 hidden text-right text-[13px] font-black uppercase tracking-[0.42em] text-color md:bottom-12 md:right-12 md:block"
        >
          <div>Rustam Kerimov</div>
          <div>Graphic designer</div>
        </motion.div>
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
