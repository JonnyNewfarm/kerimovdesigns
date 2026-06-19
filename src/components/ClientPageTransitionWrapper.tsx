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

const DESKTOP_ENTER_DURATION = 950;
const DESKTOP_LEAVE_DURATION = 650;

const MOBILE_ENTER_DURATION = 760;
const MOBILE_LEAVE_DURATION = 460;

const MOBILE_VIEWPORT_EXTRA_COVER = 120;

const transitionEase = [0.76, 0, 0.24, 1] as const;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };

    check();

    window.addEventListener("resize", check);

    return () => {
      window.removeEventListener("resize", check);
    };
  }, []);

  return isMobile;
}

function useViewportSize(isMobile: boolean) {
  const [size, setSize] = useState({
    width: 0,
    visibleHeight: 0,
    coverHeight: 0,
  });

  useEffect(() => {
    let frameId: number | null = null;

    const update = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const width = window.innerWidth;

        const visibleHeight = Math.ceil(
          window.visualViewport?.height ?? window.innerHeight,
        );

        const coverHeight = Math.ceil(
          visibleHeight + (isMobile ? MOBILE_VIEWPORT_EXTRA_COVER : 0),
        );

        setSize({
          width,
          visibleHeight,
          coverHeight,
        });
      });
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [isMobile]);

  return size;
}

function getInitialPosition(direction: TransitionDirection) {
  return {
    x: direction === "right" ? "100%" : "-100%",
    y: "0%",
  };
}

function CurvedOverlay({
  status,
  direction,
  isMobile,
  width,
  height,
}: {
  status: TransitionStatus;
  direction: TransitionDirection;
  isMobile: boolean;
  width: number;
  height: number;
}) {
  if (!width || !height) {
    return <div className="fixed inset-0 bg-dark" />;
  }

  const sideCurve = isMobile ? 90 : 220;
  const leaveCurve = isMobile ? 45 : 150;

  const enteringFromLeftInitialPath = `
    M 0 0
    L ${width} 0
    Q ${width + sideCurve} ${height / 2} ${width} ${height}
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
    Q ${-sideCurve} ${height / 2} 0 ${height}
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
    Q ${width / 2} ${height + leaveCurve} 0 ${height}
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
      key={`${status}-${direction}-${isMobile ? "mobile" : "desktop"}-${width}-${height}`}
      className="absolute left-0 top-0 h-full w-screen overflow-visible"
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
          duration:
            status === "entering"
              ? isMobile
                ? 0.76
                : 0.95
              : isMobile
                ? 0.42
                : 0.65,
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
  isMobile,
}: {
  status: TransitionStatus;
  label: string;
  direction: TransitionDirection;
  isMobile: boolean;
}) {
  const labelLength = label.length;

  const fontVw = isMobile
    ? Math.min(14, Math.max(7, 120 / Math.max(labelLength * 0.95, 7)))
    : Math.min(13, Math.max(3.8, 96 / Math.max(labelLength * 0.95, 7)));

  const textStartX = direction === "right" ? "10vw" : "-10vw";

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 md:px-8">
      <motion.h2
        className="m-0 max-w-[92vw] whitespace-nowrap text-center text-color font-extrabold uppercase tracking-[-0.035em] leading-[0.86] md:max-w-[96vw]"
        style={{
          fontSize: isMobile
            ? `clamp(32px, ${fontVw}vw, 86px)`
            : `clamp(34px, ${fontVw}vw, 230px)`,
        }}
        initial={{
          x: textStartX,
          y: "0vh",
          scaleX: 1.04,
        }}
        animate={{
          x: "0vw",
          y: "0vh",
          scaleX: 1,
        }}
        transition={{
          duration: status === "entering" ? 0.55 : 0,
          delay: status === "entering" ? 0.08 : 0,
          ease: transitionEase,
        }}
      >
        {label}
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
  const isMobile = useIsMobile();
  const viewportSize = useViewportSize(isMobile);

  const [status, setStatus] = useState<TransitionStatus>("idle");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [transitionLabel, setTransitionLabel] = useState("");
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("left");

  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const enterDuration = isMobile
    ? MOBILE_ENTER_DURATION
    : DESKTOP_ENTER_DURATION;

  const leaveDuration = isMobile
    ? MOBILE_LEAVE_DURATION
    : DESKTOP_LEAVE_DURATION;

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
    }, enterDuration);
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
    }, leaveDuration);
  }, [pathname, pendingHref, leaveDuration]);

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, []);

  const isTransitioning = status !== "idle";
  const initialPosition = getInitialPosition(transitionDirection);

  const coverHeight = viewportSize.coverHeight
    ? `${viewportSize.coverHeight}px`
    : isMobile
      ? `calc(100dvh + ${MOBILE_VIEWPORT_EXTRA_COVER}px)`
      : "100dvh";

  const visibleHeight = viewportSize.visibleHeight
    ? `${viewportSize.visibleHeight}px`
    : "100dvh";

  const overlayStyle = useMemo(
    () => ({
      height: coverHeight,
    }),
    [coverHeight],
  );

  const contentStyle = useMemo(
    () => ({
      height: visibleHeight,
    }),
    [visibleHeight],
  );

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
            className="fixed left-0 top-0 z-[99999] w-screen pointer-events-none overflow-visible text-dark will-change-transform"
            style={overlayStyle}
            initial={initialPosition}
            animate={{
              x: "0%",
              y: status === "entering" ? "0%" : "-100%",
            }}
            exit={{
              y: "-100%",
            }}
            transition={{
              duration:
                status === "entering"
                  ? isMobile
                    ? 0.76
                    : 0.95
                  : isMobile
                    ? 0.46
                    : 0.65,
              ease: transitionEase,
            }}
          >
            <CurvedOverlay
              status={status}
              direction={transitionDirection}
              isMobile={isMobile}
              width={viewportSize.width || 1}
              height={viewportSize.coverHeight || 1}
            />

            <div
              className="relative z-10 w-full overflow-hidden"
              style={contentStyle}
            >
              <DestinationText status={status} label={transitionLabel} />

              <TransitionText
                status={status}
                label={transitionLabel}
                direction={transitionDirection}
                isMobile={isMobile}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
