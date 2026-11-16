"use client";

import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const COUNT_SPEED = 95;
const MIN_SPINNER_DURATION = 400;

const STORAGE_KEY = "kerimov-preloader-completed";

const ease = [0.76, 0, 0.24, 1] as const;

type LoadingMode = "checking" | "preloader" | "spinner" | "none";

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

  const [spinnerReady, setSpinnerReady] = useState(false);

  const [revealStarted, setRevealStarted] = useState(false);

  const [dismissed, setDismissed] = useState(false);

  const [hidden, setHidden] = useState(false);

  const fillRef = useRef<HTMLSpanElement>(null);

  const currentRef = useRef(0);
  const progressRef = useRef(0);
  const readyRef = useRef(false);

  const callbackRef = useRef(onRevealStart);
  const revealStartedRef = useRef(false);

  const assetsReady = !active && (total === 0 || loaded >= total);

  const fullyReady = threeReady && assetsReady;

  // Choose loading mode.
  useLayoutEffect(() => {
    let completed = false;

    try {
      completed = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Storage may be unavailable.
    }

    const desktop = window.matchMedia("(min-width: 1024px)").matches;

    if (!completed) {
      setMode("preloader");
    } else if (desktop) {
      setMode("spinner");
    } else {
      setMode("none");
    }
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

  // Desktop spinner: display for at least 700ms.
  useEffect(() => {
    if (mode !== "spinner") return;

    const timer = window.setTimeout(() => {
      setSpinnerReady(true);
    }, MIN_SPINNER_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [mode]);

  // Desktop refresh / route return.
  useEffect(() => {
    if (mode !== "spinner") return;
    if (!fullyReady) return;
    if (!spinnerReady) return;

    startReveal();
  }, [mode, fullyReady, spinnerReady, startReveal]);

  // Mobile return / refresh: no spinner.
  useEffect(() => {
    if (mode !== "none") return;
    if (!fullyReady) return;

    startReveal();
  }, [mode, fullyReady, startReveal]);

  // Full preloader on first visit.
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
      // Storage may be unavailable.
    }

    setHidden(true);
  };

  return (
    <>
      <style>
        {`
          @keyframes kerimov-spinner-rotate {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      {/* DESKTOP SPINNER */}
      {mode === "spinner" && !revealStarted && (
        <div
          role="status"
          aria-label="Loading scene"
          className="
            pointer-events-none
            fixed
            bottom-9
            right-[3.1%]
            z-[9999]
            hidden
            items-center
            justify-center
            text-[#e7e3dd]
            lg:flex
          "
        >
          <div
            className="
              h-6
              w-6
              rounded-full
              border-2
              border-current
              border-t-transparent
            "
            style={{
              animation: "kerimov-spinner-rotate 0.7s linear infinite",
              transformOrigin: "center",
              willChange: "transform",
            }}
          />
        </div>
      )}

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
