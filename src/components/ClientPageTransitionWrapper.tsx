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
type TransitionVariant = "horizontal" | "projectDetails";

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

const DESKTOP_HORIZONTAL_ENTER_DURATION = 750;
const MOBILE_HORIZONTAL_ENTER_DURATION = 600;

const DESKTOP_PROJECT_ENTER_DURATION = 950;
const MOBILE_PROJECT_ENTER_DURATION = 760;

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

  return "horizontal";
}

function getEnterDuration(
  variant: TransitionVariant,
  isMobile: boolean,
): number {
  if (variant === "projectDetails") {
    return isMobile
      ? MOBILE_PROJECT_ENTER_DURATION
      : DESKTOP_PROJECT_ENTER_DURATION;
  }

  return isMobile
    ? MOBILE_HORIZONTAL_ENTER_DURATION
    : DESKTOP_HORIZONTAL_ENTER_DURATION;
}

function getEnterDurationSeconds(
  variant: TransitionVariant,
  isMobile: boolean,
): number {
  return getEnterDuration(variant, isMobile) / 1000;
}

function getInitialPosition(
  variant: TransitionVariant,
  direction: TransitionDirection,
) {
  if (variant === "projectDetails") {
    return {
      x: "0%",
      y: "100%",
    };
  }

  return {
    x: direction === "right" ? "100%" : "-100%",
    y: "0%",
  };
}

function CurvedOverlay({
  status,
  direction,
  variant,
  isMobile,
  width,
  height,
}: {
  status: TransitionStatus;
  direction: TransitionDirection;
  variant: TransitionVariant;
  isMobile: boolean;
  width: number;
  height: number;
}) {
  if (!width || !height) {
    return <div className="fixed inset-0 bg-dark" />;
  }

  const sideCurve = isMobile ? 90 : 220;
  const topCurve = isMobile ? 75 : 190;
  const bottomCurve = isMobile ? 45 : 150;

  /*
   * ORIGINAL REGULAR ENTERING
   * Ikke endret.
   */

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

  /*
   * ORIGINAL PROJECT DETAIL ENTERING
   * Ikke endret.
   */

  const projectEnteringInitialPath = `
    M 0 ${topCurve}
    Q ${width / 2} ${-topCurve} ${width} ${topCurve}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  const projectEnteringTargetPath = `
    M 0 0
    Q ${width / 2} 0 ${width} 0
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  /*
   * ORIGINAL PROJECT DETAIL LEAVING
   * Ikke endret.
   */

  const projectLeavingInitialPath = `
    M 0 0
    L ${width} 0
    L ${width} ${height}
    Q ${width / 2} ${height + bottomCurve} 0 ${height}
    Z
  `;

  const projectLeavingTargetPath = `
    M 0 0
    L ${width} 0
    L ${width} ${height}
    Q ${width / 2} ${height} 0 ${height}
    Z
  `;

  const leavingToRightInitialPath = `
    M 0 0
    Q ${-bottomCurve} ${height / 2} 0 ${height}
    L ${width} ${height}
    L ${width} 0
    Z
  `;

  const leavingToRightTargetPath = `
    M 0 0
    Q 0 ${height / 2} 0 ${height}
    L ${width} ${height}
    L ${width} 0
    Z
  `;

  const leavingToLeftInitialPath = `
    M 0 0
    L ${width} 0
    Q ${width + bottomCurve} ${height / 2} ${width} ${height}
    L 0 ${height}
    Z
  `;

  const leavingToLeftTargetPath = `
    M 0 0
    L ${width} 0
    Q ${width} ${height / 2} ${width} ${height}
    L 0 ${height}
    Z
  `;

  let initialPath: string;
  let targetPath: string;

  if (status === "leaving") {
    if (variant === "projectDetails") {
      initialPath = projectLeavingInitialPath;
      targetPath = projectLeavingTargetPath;
    } else if (direction === "right") {
      initialPath = leavingToLeftInitialPath;
      targetPath = leavingToLeftTargetPath;
    } else {
      initialPath = leavingToRightInitialPath;
      targetPath = leavingToRightTargetPath;
    }
  } else if (variant === "projectDetails") {
    initialPath = projectEnteringInitialPath;
    targetPath = projectEnteringTargetPath;
  } else if (direction === "right") {
    initialPath = enteringFromRightInitialPath;
    targetPath = enteringFromRightTargetPath;
  } else {
    initialPath = enteringFromLeftInitialPath;
    targetPath = enteringFromLeftTargetPath;
  }

  const pathDuration =
    status === "entering"
      ? getEnterDurationSeconds(variant, isMobile)
      : isMobile
        ? 0.42
        : 0.65;

  return (
    <motion.svg
      key={`${status}-${variant}-${direction}-${
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
  direction,
  variant,
  isMobile,
}: {
  status: TransitionStatus;
  label: string;
  direction: TransitionDirection;
  variant: TransitionVariant;
  isMobile: boolean;
}) {
  const labelLength = label.length;

  const fontVw = isMobile
    ? Math.min(14, Math.max(7, 120 / Math.max(labelLength * 0.95, 7)))
    : Math.min(13, Math.max(3.8, 96 / Math.max(labelLength * 0.95, 7)));

  const initialTextPosition =
    variant === "projectDetails"
      ? {
          x: "0vw",
          y: "12vh",
        }
      : {
          x: direction === "right" ? "10vw" : "-10vw",
          y: "0vh",
        };

  const textDuration =
    variant === "projectDetails" ? 0.55 : isMobile ? 0.4 : 0.46;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 md:px-8">
      <motion.div
        className="w-fit max-w-[92vw] md:max-w-[96vw]"
        initial={{
          ...initialTextPosition,
          scaleX: variant === "projectDetails" ? 1 : 1.04,
        }}
        animate={{
          x: "0vw",
          y: "0vh",
          scaleX: 1,
        }}
        transition={{
          duration: status === "entering" ? textDuration : 0,
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
            duration: variant === "projectDetails" ? 0.35 : 0.28,
            delay: variant === "projectDetails" ? 0.2 : 0.12,
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
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("left");
  const [transitionVariant, setTransitionVariant] =
    useState<TransitionVariant>("horizontal");

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
    direction: TransitionDirection = "left",
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
    const enterDuration = getEnterDuration(variant, isMobile);

    setPendingHref(href);
    setTransitionLabel(label || "Loading");
    setTransitionDirection(direction);
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
      setTransitionVariant("horizontal");
    }, leaveDuration);
  }, [pathname, pendingHref, leaveDuration]);

  useEffect(() => {
    return () => {
      clearCurrentTimeout();
    };
  }, []);

  const isTransitioning = status !== "idle";

  const initialPosition = getInitialPosition(
    transitionVariant,
    transitionDirection,
  );

  const overlayEnterDuration = getEnterDurationSeconds(
    transitionVariant,
    isMobile,
  );

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

  const leavingPosition =
    transitionVariant === "projectDetails"
      ? {
          x: "0%",
          y: "-100%",
        }
      : {
          x: transitionDirection === "right" ? "-100%" : "100%",
          y: "0%",
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
              direction={transitionDirection}
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
                direction={transitionDirection}
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
