"use client";

import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COUNT_SPEED = 95;
const ease = [0.76, 0, 0.24, 1] as const;

type SceneReadyProps = {
  onReady: () => void;
};

export function SceneReadySignal({ onReady }: SceneReadyProps) {
  const frames = useRef(0);
  const notified = useRef(false);
  const scheduledFrame = useRef<number | null>(null);

  useFrame(() => {
    if (notified.current) return;

    frames.current += 1;

    if (frames.current >= 2) {
      notified.current = true;

      scheduledFrame.current = window.requestAnimationFrame(onReady);
    }
  });

  useEffect(() => {
    return () => {
      if (scheduledFrame.current !== null) {
        window.cancelAnimationFrame(scheduledFrame.current);
      }
    };
  }, []);

  return null;
}

type Props = {
  threeReady: boolean;
  onRevealStart?: () => void;
};

export default function SitePreloader({ threeReady, onRevealStart }: Props) {
  const { progress, active, loaded, total } = useProgress();

  const [dismissed, setDismissed] = useState(false);

  const fillRef = useRef<HTMLSpanElement>(null);

  const currentRef = useRef(0);
  const progressRef = useRef(0);
  const readyRef = useRef(false);
  const callbackRef = useRef(onRevealStart);

  const assetsReady = !active && (total === 0 || loaded >= total);

  const fullyReady = threeReady && assetsReady;

  useEffect(() => {
    callbackRef.current = onRevealStart;
  }, [onRevealStart]);

  useEffect(() => {
    readyRef.current = fullyReady;
  }, [fullyReady]);

  useEffect(() => {
    if (Number.isFinite(progress)) {
      progressRef.current = Math.max(
        progressRef.current,
        Math.min(100, progress),
      );
    }
  }, [progress]);

  useEffect(() => {
    let frameId = 0;
    let finished = false;

    const startedAt = performance.now();
    let previousTime = startedAt;

    const update = (now: number) => {
      if (finished) return;

      const delta = Math.min(Math.max((now - previousTime) / 1000, 0), 0.05);

      previousTime = now;

      const elapsed = (now - startedAt) / 1000;

      const visualProgress = 94 * (1 - Math.exp(-elapsed * 2));

      const target = readyRef.current
        ? 100
        : Math.min(96, Math.max(visualProgress, progressRef.current));

      currentRef.current = Math.min(
        target,
        currentRef.current + COUNT_SPEED * delta,
      );

      // Fill the letters from left to right.
      if (fillRef.current) {
        fillRef.current.style.clipPath = `inset(0 ${100 - currentRef.current}% 0 0)`;
      }

      if (readyRef.current && currentRef.current >= 100) {
        finished = true;

        callbackRef.current?.();
        setDismissed(true);
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="site-preloader"
          initial={false}
          exit={{
            y: "-100%",
          }}
          transition={{
            duration: 0.85,
            ease,
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0e100c] text-[#e7e3dd]"
          role="status"
          aria-label="Loading portfolio"
          aria-live="off"
        >
          <div className="relative inline-block select-none font-bueno text-xl font-medium uppercase leading-none tracking-[0.22em]">
            <span className="text-[#e7e3dd]/20">KERIMOV DESIGNS</span>

            <span
              ref={fillRef}
              aria-hidden="true"
              className="absolute inset-0 whitespace-nowrap text-[#e7e3dd]"
              style={{
                clipPath: "inset(0 100% 0 0)",
              }}
            >
              KERIMOV DESIGNS
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
