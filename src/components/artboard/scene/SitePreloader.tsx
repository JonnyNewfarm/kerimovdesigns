"use client";

import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const COUNT_SPEED = 95;
const MIN_SPINNER_DURATION = 400;

const ease = [0.76, 0, 0.24, 1] as const;

const STORAGE_KEY = "kerimov-preloader-completed";

type LoadingMode = "checking" | "preloader" | "spinner" | "none";

// Remembers whether Home has mounted in this document.
let homeMountedInDocument = false;

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

  const [mode, setMode] = useState<LoadingMode>("checking");

  const [spinnerMinimumPassed, setSpinnerMinimumPassed] = useState(false);

  const [revealStarted, setRevealStarted] = useState(false);

  const [dismissed, setDismissed] = useState(false);

  const [hidden, setHidden] = useState(false);

  const modeRef = useRef<LoadingMode | null>(null);

  const fillRef = useRef<HTMLSpanElement>(null);

  const currentRef = useRef(0);
  const progressRef = useRef(0);
  const readyRef = useRef(false);

  const callbackRef = useRef(onRevealStart);
  const revealStartedRef = useRef(false);

  const assetsReady = !active && (total === 0 || loaded >= total);

  const fullyReady = threeReady && assetsReady;

  // Decide which loading experience to use.
  useLayoutEffect(() => {
    if (modeRef.current === null) {
      let preloaderCompleted = false;

      try {
        preloaderCompleted = window.sessionStorage.getItem(STORAGE_KEY) === "1";
      } catch {
        // Storage unavailable.
      }

      let fromAnotherRoute = homeMountedInDocument;

      try {
        const entry = performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined;

        if (entry?.name) {
          const initialPath = new URL(entry.name).pathname;

          if (initialPath !== window.location.pathname) {
            fromAnotherRoute = true;
          }
        }
      } catch {
        // Navigation timing unavailable.
      }

      if (!preloaderCompleted) {
        modeRef.current = "preloader";
      } else if (fromAnotherRoute) {
        modeRef.current = "spinner";
      } else {
        modeRef.current = "none";
      }

      homeMountedInDocument = true;
    }

    setMode(modeRef.current);
  }, []);

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

  const startReveal = useCallback(() => {
    if (revealStartedRef.current) return;

    revealStartedRef.current = true;

    callbackRef.current?.();
    setRevealStarted(true);
  }, []);

  // Keep the spinner visible for at least 400ms.
  useEffect(() => {
    if (mode !== "spinner") return;

    const timeout = window.setTimeout(() => {
      setSpinnerMinimumPassed(true);
    }, MIN_SPINNER_DURATION);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [mode]);

  // Returning from another route.
  useEffect(() => {
    if (mode !== "spinner") return;
    if (!fullyReady) return;
    if (!spinnerMinimumPassed) return;

    startReveal();
  }, [mode, fullyReady, spinnerMinimumPassed, startReveal]);

  // Already visited Home, but this isn't a route return.
  useEffect(() => {
    if (mode !== "none") return;
    if (!fullyReady) return;

    startReveal();
  }, [mode, fullyReady, startReveal]);

  // First visit: original full-screen preloader.
  useEffect(() => {
    if (mode !== "preloader") return;

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

      if (fillRef.current) {
        fillRef.current.style.clipPath = `inset(0 ${100 - currentRef.current}% 0 0)`;
      }

      if (readyRef.current && currentRef.current >= 100) {
        finished = true;

        startReveal();
        setDismissed(true);

        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [mode, startReveal]);

  const handlePreloaderComplete = () => {
    if (!dismissed) return;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage unavailable.
    }

    setHidden(true);
  };

  return (
    <>
      {/* SPINNER — RETURNING FROM ANOTHER ROUTE */}
      <AnimatePresence>
        {mode === "spinner" && !revealStarted && (
          <motion.div
            key="scene-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.15,
            }}
            className="
              pointer-events-none
              fixed
              bottom-7
              right-[5%]
              z-[9999]
              flex
              items-center
              justify-center
              text-color

              lg:bottom-9
              lg:right-[3.1%]
            "
            role="status"
            aria-label="Loading scene"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 0.8,
                ease: "linear",
                repeat: Infinity,
              }}
              className="
                h-6
                w-6
                rounded-full
                border-2
                border-current
                border-t-transparent
              "
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL PRELOADER — FIRST VISIT */}
      {mode === "preloader" && !hidden && (
        <motion.div
          initial={false}
          animate={{
            y: dismissed ? "-100%" : "0%",
          }}
          transition={{
            duration: 0.85,
            ease,
          }}
          onAnimationComplete={handlePreloaderComplete}
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-[#0e100c]
            text-[#e7e3dd]
          "
          role="status"
          aria-label="Loading portfolio"
          aria-live="off"
        >
          <div
            className="
              relative
              inline-block
              select-none
              font-bueno
              text-xl
              font-medium
              uppercase
              leading-none
              tracking-[0.22em]
            "
          >
            <span className="text-[#e7e3dd]/20">KERIMOV DESIGNS</span>

            <span
              ref={fillRef}
              aria-hidden="true"
              className="
                absolute
                inset-0
                whitespace-nowrap
                text-[#e7e3dd]
              "
              style={{
                clipPath: "inset(0 100% 0 0)",
              }}
            >
              KERIMOV DESIGNS
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}
