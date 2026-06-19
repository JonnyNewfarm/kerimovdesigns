"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export type TransitionDirection = "left" | "right";

type TransitionStatus = "idle" | "entering" | "leaving";

type PageTransitionContextType = {
  startTransition: (
    href: string,
    label?: string,
    direction?: TransitionDirection,
  ) => void;
  isTransitioning: boolean;
};

const PageTransitionContext = createContext<PageTransitionContextType | null>(
  null,
);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      "usePageTransition must be used inside ClientPageTransitionWrapper",
    );
  }

  return context;
}

interface ClientPageTransitionWrapperProps {
  children: ReactNode;
}

const ENTER_DURATION = 950;
const LEAVE_DURATION = 650;

const transitionEase = [0.76, 0, 0.24, 1] as const;
const letterEase = [0.22, 1, 0.36, 1] as const;

function getInitialPosition(direction: TransitionDirection) {
  return {
    x: direction === "right" ? "100%" : "-100%",
    y: "0%",
  };
}

function CurvedOverlay({
  status,
  direction,
}: {
  status: TransitionStatus;
  direction: TransitionDirection;
}) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const resize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const { width, height } = dimensions;

  if (!width || !height) {
    return <div className="fixed inset-0 bg-dark" />;
  }

  const curve = 300;

  const enteringFromLeftInitialPath = `
    M 0 0
    L ${width} 0
    Q ${width + curve} ${height / 2} ${width} ${height}
    L 0 ${height}
    Z
  `;

  const enteringFromLeftTargetPath = `
    M 0 0
    L ${width} 0
    Q ${width} ${height / 2} ${width} ${height}
    L 0 ${height}
    Z
  `;

  const enteringFromRightInitialPath = `
    M ${width} 0
    L 0 0
    Q ${-curve} ${height / 2} 0 ${height}
    L ${width} ${height}
    Z
  `;

  const enteringFromRightTargetPath = `
    M ${width} 0
    L 0 0
    Q 0 ${height / 2} 0 ${height}
    L ${width} ${height}
    Z
  `;

  const leavingInitialPath = `
    M 0 0
    L ${width} 0
    L ${width} ${height}
    Q ${width / 2} ${height + curve} 0 ${height}
    Z
  `;

  const leavingTargetPath = `
    M 0 0
    L ${width} 0
    L ${width} ${height}
    Q ${width / 2} ${height} 0 ${height}
    Z
  `;

  const initialPath =
    status === "leaving"
      ? leavingInitialPath
      : direction === "right"
        ? enteringFromRightInitialPath
        : enteringFromLeftInitialPath;

  const targetPath =
    status === "leaving"
      ? leavingTargetPath
      : direction === "right"
        ? enteringFromRightTargetPath
        : enteringFromLeftTargetPath;

  return (
    <motion.svg
      key={`${status}-${direction}`}
      className="absolute inset-0 h-screen w-screen overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <motion.path
        fill="#667a6c"
        initial={{
          d: initialPath,
        }}
        animate={{
          d: targetPath,
        }}
        transition={{
          duration: status === "entering" ? 0.95 : 0.65,
          ease: transitionEase,
        }}
      />
    </motion.svg>
  );
}

function TransitionText({
  status,
  label,
  direction,
}: {
  status: TransitionStatus;
  label: string;
  direction: TransitionDirection;
}) {
  const letters = useMemo(() => label.split(""), [label]);

  const labelLength = label.length;
  const isLongLabel = labelLength >= 12;
  const isVeryLongLabel = labelLength >= 18;

  const fontVw = Math.min(
    13,
    Math.max(3.8, 96 / Math.max(labelLength * 0.95, 7)),
  );

  const textStartX = isLongLabel
    ? direction === "right"
      ? "3vw"
      : "-3vw"
    : direction === "right"
      ? "12vw"
      : "-12vw";

  const letterStartX = direction === "right" ? "140%" : "-140%";

  const hiddenClip =
    direction === "right" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  const visibleClip = "inset(0 0% 0 0%)";
  const leaveClip = "inset(0 0% 100% 0%)";

  const enterStagger = isVeryLongLabel ? 0.008 : isLongLabel ? 0.014 : 0.045;
  const leaveStagger = isVeryLongLabel ? 0.004 : isLongLabel ? 0.007 : 0.012;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 md:px-8">
      <motion.h2
        className="m-0 flex max-w-[96vw] whitespace-nowrap text-center text-color font-extrabold uppercase tracking-[-0.04em] leading-[0.86]"
        style={{
          fontSize: `clamp(34px, ${fontVw}vw, 230px)`,
        }}
        initial={{
          x: textStartX,
          y: "0vh",
        }}
        animate={{
          x: "0vw",
          y: status === "entering" ? "0vh" : "-16vh",
        }}
        transition={{
          duration: status === "entering" ? 0.72 : 0.45,
          delay: status === "entering" ? 0.02 : 0,
          ease: transitionEase,
        }}
      >
        {letters.map((letter, index) => {
          const isSpace = letter === " ";

          const staggerIndex =
            direction === "right" ? letters.length - 1 - index : index;

          const enterDelay = 0.08 + staggerIndex * enterStagger;
          const leaveDelay = staggerIndex * leaveStagger;

          return (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block overflow-hidden px-[0.01em] will-change-[clip-path]"
              initial={{
                clipPath: hiddenClip,
              }}
              animate={{
                clipPath: status === "entering" ? visibleClip : leaveClip,
              }}
              transition={{
                duration: status === "entering" ? 0.58 : 0.3,
                delay: status === "entering" ? enterDelay : leaveDelay,
                ease: transitionEase,
              }}
            >
              <motion.span
                className="inline-block will-change-transform"
                initial={{
                  x: letterStartX,
                  scaleX: 1.25,
                  transformOrigin:
                    direction === "right" ? "left center" : "right center",
                }}
                animate={{
                  x: "0%",
                  scaleX: status === "entering" ? 1 : 0.92,
                }}
                transition={{
                  x: {
                    duration: status === "entering" ? 0.58 : 0.3,
                    delay: status === "entering" ? enterDelay : leaveDelay,
                    ease: letterEase,
                  },
                  scaleX: {
                    duration: status === "entering" ? 0.58 : 0.3,
                    delay: status === "entering" ? enterDelay : leaveDelay,
                    ease: transitionEase,
                  },
                }}
              >
                {isSpace ? "\u00A0" : letter}
              </motion.span>
            </motion.span>
          );
        })}
      </motion.h2>
    </div>
  );
}

function DestinationText({
  status,
  label,
}: {
  status: TransitionStatus;
  label: string;
}) {
  return (
    <motion.div
      className="absolute bottom-6 right-6 hidden max-w-[70vw] text-right text-color md:block"
      initial={{
        y: 20,
        opacity: 0,
      }}
      animate={{
        y: status === "entering" ? 0 : -20,
        opacity: status === "entering" ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
        delay: status === "entering" ? 0.35 : 0,
        ease: transitionEase,
      }}
    >
      <p className="m-0 text-[12px] uppercase leading-none opacity-60">
        Destination
      </p>

      <p className="m-0 mt-1 text-[15px] font-extrabold uppercase leading-none tracking-[-0.04em]">
        {label}
      </p>
    </motion.div>
  );
}

export default function ClientPageTransitionWrapper({
  children,
}: ClientPageTransitionWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [transitionLabel, setTransitionLabel] = useState("");
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("left");

  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTransition = (
    href: string,
    label?: string,
    direction: TransitionDirection = "left",
  ) => {
    if (!href || href === pathname || status !== "idle") return;

    if (shouldReduceMotion) {
      router.push(href);
      return;
    }

    clearCurrentTimeout();

    setPendingHref(href);
    setTransitionLabel(label || "Loading");
    setTransitionDirection(direction);
    setStatus("entering");

    timeoutRef.current = setTimeout(() => {
      router.push(href);
    }, ENTER_DURATION);
  };

  useEffect(() => {
    if (pathname === previousPathname.current) return;

    previousPathname.current = pathname;

    if (!pendingHref) return;

    clearCurrentTimeout();

    setStatus("leaving");

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      setPendingHref(null);
      setTransitionLabel("");
    }, LEAVE_DURATION);
  }, [pathname, pendingHref]);

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, []);

  const isTransitioning = status !== "idle";
  const initialPosition = getInitialPosition(transitionDirection);

  return (
    <PageTransitionContext.Provider
      value={{
        startTransition,
        isTransitioning,
      }}
    >
      {children}

      <AnimatePresence>
        {isTransitioning && !shouldReduceMotion && (
          <motion.div
            className="fixed inset-0 z-[99999] pointer-events-none overflow-visible text-dark will-change-transform"
            initial={initialPosition}
            animate={{
              x: "0%",
              y: status === "entering" ? "0%" : "-100%",
            }}
            exit={{
              y: "-100%",
            }}
            transition={{
              duration: status === "entering" ? 0.95 : 0.65,
              ease: transitionEase,
            }}
          >
            <CurvedOverlay status={status} direction={transitionDirection} />

            <div className="relative z-10 h-full w-full overflow-hidden">
              <DestinationText status={status} label={transitionLabel} />

              <TransitionText
                status={status}
                label={transitionLabel}
                direction={transitionDirection}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
