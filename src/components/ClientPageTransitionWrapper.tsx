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
type TransitionVariant = "destination" | "projectDetails";

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
const MOBILE_ENTER_DURATION = 760;

const DESKTOP_LEAVE_DURATION = 650;
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

function getTransitionVariant(href: string): TransitionVariant {
  const destinationPath = href.split("?")[0].split("#")[0];

  if (destinationPath.startsWith("/project/")) {
    return "projectDetails";
  }

  return "destination";
}

function getEnterDuration(isMobile: boolean): number {
  return isMobile ? MOBILE_ENTER_DURATION : DESKTOP_ENTER_DURATION;
}

function getEnterDurationSeconds(isMobile: boolean): number {
  return getEnterDuration(isMobile) / 1000;
}

function getInitialPosition() {
  return {
    x: "0%",
    y: "100%",
  };
}

function CurvedOverlay({
  status,
  variant,
  isMobile,
  width,
  height,
}: {
  status: TransitionStatus;
  variant: TransitionVariant;
  isMobile: boolean;
  width: number;
  height: number;
}) {
  if (!width || !height) {
    return (
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: variant === "projectDetails" ? "#4b4f47" : "#667a6c",
        }}
      />
    );
  }

  const topCurve = 10;
  const bottomCurve = 10;

  const enteringInitialPath = `
    M 0 ${topCurve}
    Q ${width / 2} ${-topCurve} ${width} ${topCurve}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  const enteringTargetPath = `
    M 0 0
    Q ${width / 2} 0 ${width} 0
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  /*
   * Alle overganger forlater skjermen oppover.
   */
  const leavingInitialPath = `
    M 0 0
    L ${width} 0
    L ${width} ${height}
    Q ${width / 2} ${height + bottomCurve} 0 ${height}
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
    status === "leaving" ? leavingInitialPath : enteringInitialPath;

  const targetPath =
    status === "leaving" ? leavingTargetPath : enteringTargetPath;

  const pathDuration =
    status === "entering"
      ? getEnterDurationSeconds(isMobile)
      : isMobile
        ? 0.6
        : 0.65;

  return (
    <motion.svg
      key={`${status}-${variant}-${
        isMobile ? "mobile" : "desktop"
      }-${width}-${height}`}
      className="absolute left-0 top-0 h-full w-screen overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <motion.path
        fill={variant === "projectDetails" ? "#4b4f47" : "#667a6c"}
        initial={{
          d: initialPath,
        }}
        animate={{
          d: targetPath,
        }}
        transition={{
          duration: pathDuration,
          ease: transitionEase,
        }}
      />
    </motion.svg>
  );
}

function TransitionText({
  status,
  label,
  variant,
  isMobile,
}: {
  status: TransitionStatus;
  label: string;
  variant: TransitionVariant;
  isMobile: boolean;
}) {
  const labelLength = label.length;

  const fontVw = isMobile
    ? Math.min(14, Math.max(7, 120 / Math.max(labelLength * 0.95, 7)))
    : Math.min(13, Math.max(3.8, 96 / Math.max(labelLength * 0.95, 7)));

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 md:px-8">
      <motion.div
        className="w-fit max-w-[92vw] md:max-w-[96vw]"
        initial={{
          x: "0vw",
          y: "12vh",
          scaleX: 1,
        }}
        animate={{
          x: "0vw",
          y: "0vh",
          scaleX: 1,
        }}
        transition={{
          duration: status === "entering" ? 0.55 : 0,
          delay: status === "entering" ? 0.05 : 0,
          ease: transitionEase,
        }}
      >
        <motion.p
          className="mb-2 text-left text-[18px] font-extrabold leading-none tracking-[-0.03em] text-white/85 md:mb-4 md:text-[30px]"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: 0.2,
            ease: transitionEase,
          }}
        >
          {variant === "projectDetails" ? "Project:" : "Destination:"}
        </motion.p>

        <h2
          className="m-0 whitespace-nowrap text-left font-extrabold uppercase leading-[0.86] tracking-[-0.02em] text-white/85"
          style={{
            fontSize: isMobile
              ? `clamp(32px, ${fontVw}vw, 86px)`
              : `clamp(34px, ${fontVw}vw, 230px)`,
          }}
        >
          {label}
        </h2>
      </motion.div>
    </div>
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
  const [transitionVariant, setTransitionVariant] =
    useState<TransitionVariant>("destination");

  const previousPathname = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    _direction: TransitionDirection = "left",
  ) => {
    if (!href || href === pathname || status !== "idle") {
      return;
    }

    if (shouldReduceMotion) {
      router.push(href);
      return;
    }

    clearCurrentTimeout();

    const variant = getTransitionVariant(href);
    const enterDuration = getEnterDuration(isMobile);

    setPendingHref(href);
    setTransitionLabel(label || "Loading");
    setTransitionVariant(variant);
    setStatus("entering");

    timeoutRef.current = setTimeout(() => {
      router.push(href);
    }, enterDuration);
  };

  useEffect(() => {
    if (pathname === previousPathname.current) {
      return;
    }

    previousPathname.current = pathname;

    if (!pendingHref) {
      return;
    }

    clearCurrentTimeout();

    setStatus("leaving");

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      setPendingHref(null);
      setTransitionLabel("");
      setTransitionVariant("destination");
    }, leaveDuration);
  }, [pathname, pendingHref, leaveDuration]);

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, []);

  const isTransitioning = status !== "idle";

  const initialPosition = getInitialPosition();

  const overlayEnterDuration = getEnterDurationSeconds(isMobile);

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

  const leavingPosition = {
    x: "0%",
    y: "-100%",
  };

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
            className="pointer-events-none fixed left-0 top-0 z-[99999] w-screen overflow-visible text-dark will-change-transform"
            style={overlayStyle}
            initial={initialPosition}
            animate={
              status === "entering"
                ? {
                    x: "0%",
                    y: "0%",
                  }
                : leavingPosition
            }
            exit={leavingPosition}
            transition={{
              duration:
                status === "entering"
                  ? overlayEnterDuration
                  : isMobile
                    ? 0.46
                    : 0.65,
              ease: transitionEase,
            }}
          >
            <CurvedOverlay
              status={status}
              variant={transitionVariant}
              isMobile={isMobile}
              width={viewportSize.width || 1}
              height={viewportSize.coverHeight || 1}
            />

            <div
              className="relative z-10 w-full overflow-hidden"
              style={contentStyle}
            >
              <TransitionText
                status={status}
                label={transitionLabel}
                variant={transitionVariant}
                isMobile={isMobile}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
