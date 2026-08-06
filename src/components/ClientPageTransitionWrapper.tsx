"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
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

type TransitionState = {
  status: TransitionStatus;
  label: string;
  variant: TransitionVariant;
};

interface ClientPageTransitionWrapperProps {
  children: ReactNode;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(
  null,
);

const DESKTOP_ENTER_DURATION = 0.95;
const MOBILE_ENTER_DURATION = 0.8;

const DESKTOP_LEAVE_DURATION = 0.65;
const MOBILE_LEAVE_DURATION = 0.5;

const MOBILE_VIEWPORT_EXTRA_COVER = 120;

const transitionEase = [0.76, 0, 0.24, 1] as const;

const IDLE_TRANSITION: TransitionState = {
  status: "idle",
  label: "",
  variant: "destination",
};

const INITIAL_OVERLAY_POSITION = {
  y: "100%",
};

const ENTERING_OVERLAY_POSITION = {
  y: "0%",
};

const LEAVING_OVERLAY_POSITION = {
  y: "-100%",
};

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 1000;

const TOP_CURVE = 10;
const BOTTOM_CURVE = 10;

const ENTERING_INITIAL_PATH = `
  M 0 ${TOP_CURVE}
  Q ${SVG_WIDTH / 2} ${-TOP_CURVE} ${SVG_WIDTH} ${TOP_CURVE}
  L ${SVG_WIDTH} ${SVG_HEIGHT}
  L 0 ${SVG_HEIGHT}
  Z
`;

const ENTERING_TARGET_PATH = `
  M 0 0
  Q ${SVG_WIDTH / 2} 0 ${SVG_WIDTH} 0
  L ${SVG_WIDTH} ${SVG_HEIGHT}
  L 0 ${SVG_HEIGHT}
  Z
`;

const LEAVING_INITIAL_PATH = `
  M 0 0
  L ${SVG_WIDTH} 0
  L ${SVG_WIDTH} ${SVG_HEIGHT}
  Q ${SVG_WIDTH / 2} ${SVG_HEIGHT + BOTTOM_CURVE} 0 ${SVG_HEIGHT}
  Z
`;

const LEAVING_TARGET_PATH = `
  M 0 0
  L ${SVG_WIDTH} 0
  L ${SVG_WIDTH} ${SVG_HEIGHT}
  Q ${SVG_WIDTH / 2} ${SVG_HEIGHT} 0 ${SVG_HEIGHT}
  Z
`;

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      "usePageTransition must be used inside ClientPageTransitionWrapper",
    );
  }

  return context;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setIsMobile((current) => {
        if (current === mediaQuery.matches) {
          return current;
        }

        return mediaQuery.matches;
      });
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}

function getTransitionVariant(href: string): TransitionVariant {
  const destinationPath = href.split("?")[0].split("#")[0];

  if (destinationPath.startsWith("/project/")) {
    return "projectDetails";
  }

  return "destination";
}

function getEnterDuration(isMobile: boolean) {
  return isMobile ? MOBILE_ENTER_DURATION : DESKTOP_ENTER_DURATION;
}

function getLeaveDuration(isMobile: boolean) {
  return isMobile ? MOBILE_LEAVE_DURATION : DESKTOP_LEAVE_DURATION;
}

function CurvedOverlay({
  status,
  variant,
  isMobile,
}: {
  status: TransitionStatus;
  variant: TransitionVariant;
  isMobile: boolean;
}) {
  const isLeaving = status === "leaving";

  const initialPath = isLeaving ? LEAVING_INITIAL_PATH : ENTERING_INITIAL_PATH;

  const targetPath = isLeaving ? LEAVING_TARGET_PATH : ENTERING_TARGET_PATH;

  const duration = isLeaving
    ? getLeaveDuration(isMobile)
    : getEnterDuration(isMobile);

  const backgroundColor = variant === "projectDetails" ? "#4b5249" : "#626b60";
  return (
    <motion.svg
      key={status}
      aria-hidden="true"
      focusable="false"
      className="absolute left-0 top-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      preserveAspectRatio="none"
    >
      <motion.path
        fill={backgroundColor}
        initial={{
          d: initialPath,
        }}
        animate={{
          d: targetPath,
        }}
        transition={{
          duration,
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
    ? Math.min(10.5, Math.max(5.8, 92 / Math.max(labelLength, 8)))
    : Math.min(9, Math.max(3.2, 78 / Math.max(labelLength, 8)));

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 md:px-8">
      <motion.div
        className="w-fit max-w-[92vw] md:max-w-[96vw]"
        initial={{
          y: "12vh",
        }}
        animate={{
          y: "0vh",
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
          className="m-0 text-left font-extrabold uppercase leading-[0.86] tracking-[-0.02em] text-white/85"
          style={{
            fontSize: isMobile
              ? `clamp(24px, ${fontVw}vw, 84px)`
              : `clamp(24px, ${fontVw}vw, 240px)`,
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

  const [transition, setTransition] =
    useState<TransitionState>(IDLE_TRANSITION);

  const previousPathnameRef = useRef(pathname);
  const pendingHrefRef = useRef<string | null>(null);
  const statusRef = useRef<TransitionStatus>("idle");

  const isTransitioning = transition.status !== "idle";

  const startTransition = useCallback(
    (
      href: string,
      label?: string,
      _direction: TransitionDirection = "left",
    ) => {
      if (!href || href === pathname || statusRef.current !== "idle") {
        return;
      }

      if (shouldReduceMotion) {
        router.push(href);
        return;
      }

      statusRef.current = "entering";
      pendingHrefRef.current = href;

      router.prefetch(href);

      setTransition({
        status: "entering",
        label: label || "Loading",
        variant: getTransitionVariant(href),
      });
    },
    [pathname, router, shouldReduceMotion],
  );

  useEffect(() => {
    if (pathname === previousPathnameRef.current) {
      return;
    }

    previousPathnameRef.current = pathname;

    if (!pendingHrefRef.current) {
      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        statusRef.current = "leaving";

        setTransition((current) => ({
          ...current,
          status: "leaving",
        }));
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [pathname]);

  const handleOverlayAnimationComplete = useCallback(() => {
    if (statusRef.current === "entering") {
      const href = pendingHrefRef.current;

      if (href) {
        router.push(href);
      }

      return;
    }

    if (statusRef.current === "leaving") {
      statusRef.current = "idle";
      pendingHrefRef.current = null;

      setTransition(IDLE_TRANSITION);
    }
  }, [router]);

  const contextValue = useMemo<PageTransitionContextType>(
    () => ({
      startTransition,
      isTransitioning,
    }),
    [startTransition, isTransitioning],
  );

  const overlayHeight = isMobile
    ? `calc(100dvh + ${MOBILE_VIEWPORT_EXTRA_COVER}px)`
    : "100dvh";

  const contentHeight = "100dvh";

  const overlayDuration =
    transition.status === "entering"
      ? getEnterDuration(isMobile)
      : getLeaveDuration(isMobile);

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}

      {isTransitioning && !shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[99999] w-screen overflow-visible text-dark will-change-transform"
          style={{
            height: overlayHeight,
          }}
          initial={INITIAL_OVERLAY_POSITION}
          animate={
            transition.status === "entering"
              ? ENTERING_OVERLAY_POSITION
              : LEAVING_OVERLAY_POSITION
          }
          transition={{
            duration: overlayDuration,
            ease: transitionEase,
          }}
          onAnimationComplete={handleOverlayAnimationComplete}
        >
          <CurvedOverlay
            status={transition.status}
            variant={transition.variant}
            isMobile={isMobile}
          />

          <div
            className="relative z-10 w-full overflow-hidden"
            style={{
              height: contentHeight,
            }}
          >
            <TransitionText
              status={transition.status}
              label={transition.label}
              variant={transition.variant}
              isMobile={isMobile}
            />
          </div>
        </motion.div>
      )}
    </PageTransitionContext.Provider>
  );
}
