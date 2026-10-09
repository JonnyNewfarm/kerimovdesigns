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

import { useReducedMotion } from "framer-motion";

import { usePathname, useRouter } from "next/navigation";

import PageTransitionDissolve from "./PageTransitionDissolve";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TransitionDirection = "left" | "right";

export type TransitionStatus = "idle" | "entering" | "leaving";

export type TransitionVariant = "destination" | "projectDetails";

type PageTransitionContextType = {
  startTransition: (
    href: string,
    label?: string,
    direction?: TransitionDirection,
    color?: string | null,
  ) => void;

  isTransitioning: boolean;
};

type TransitionState = {
  status: TransitionStatus;

  variant: TransitionVariant;

  color: string | null;
};

interface ClientPageTransitionWrapperProps {
  children: ReactNode;
}

/*
 * =========================================================
 * CONTEXT
 * =========================================================
 */

const PageTransitionContext = createContext<PageTransitionContextType | null>(
  null,
);

const IDLE_TRANSITION: TransitionState = {
  status: "idle",

  variant: "destination",

  color: null,
};

/*
 * =========================================================
 * HOOK
 * =========================================================
 */

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      "usePageTransition must be used inside ClientPageTransitionWrapper",
    );
  }

  return context;
}

/*
 * =========================================================
 * VARIANT
 * =========================================================
 */

function getTransitionVariant(href: string): TransitionVariant {
  const destinationPath = href.split("?")[0].split("#")[0];

  if (destinationPath.startsWith("/project/")) {
    return "projectDetails";
  }

  return "destination";
}

/*
 * =========================================================
 * WRAPPER
 * =========================================================
 */

export default function ClientPageTransitionWrapper({
  children,
}: ClientPageTransitionWrapperProps) {
  const router = useRouter();

  const pathname = usePathname();

  const shouldReduceMotion = useReducedMotion();

  const [transition, setTransition] =
    useState<TransitionState>(IDLE_TRANSITION);

  const previousPathnameRef = useRef(pathname);

  const pendingHrefRef = useRef<string | null>(null);

  const statusRef = useRef<TransitionStatus>("idle");

  const pushTriggeredRef = useRef(false);

  /*
   * =====================================================
   * STATUS
   * =====================================================
   */

  const isTransitioning = transition.status !== "idle";

  /*
   * =====================================================
   * START
   * =====================================================
   */

  const startTransition = useCallback(
    (
      href: string,
      _label?: string,
      _direction: TransitionDirection = "left",
      color?: string | null,
    ) => {
      if (!href || href === pathname || statusRef.current !== "idle") {
        return;
      }

      /*
       * Reduced motion
       */

      if (shouldReduceMotion) {
        router.push(href);

        return;
      }

      statusRef.current = "entering";

      pendingHrefRef.current = href;

      pushTriggeredRef.current = false;

      /*
       * Start loading destination immediately.
       */

      router.prefetch(href);

      setTransition({
        status: "entering",

        variant: getTransitionVariant(href),

        color: color?.trim() || null,
      });
    },
    [pathname, router, shouldReduceMotion],
  );

  /*
   * =====================================================
   * SCREEN COVERED
   * =====================================================
   */

  const handleCovered = useCallback(() => {
    if (statusRef.current !== "entering" || pushTriggeredRef.current) {
      return;
    }

    const href = pendingHrefRef.current;

    if (!href) {
      return;
    }

    pushTriggeredRef.current = true;

    router.push(href);
  }, [router]);

  /*
   * =====================================================
   * PATHNAME CHANGED
   * =====================================================
   */

  useEffect(() => {
    if (pathname === previousPathnameRef.current) {
      return;
    }

    previousPathnameRef.current = pathname;

    if (!pendingHrefRef.current) {
      return;
    }

    statusRef.current = "leaving";

    setTransition((current) => ({
      ...current,

      status: "leaving",
    }));
  }, [pathname]);

  /*
   * =====================================================
   * REVEAL COMPLETE
   * =====================================================
   */

  const handleFinished = useCallback(() => {
    if (statusRef.current !== "leaving") {
      return;
    }

    statusRef.current = "idle";

    pendingHrefRef.current = null;

    pushTriggeredRef.current = false;

    setTransition(IDLE_TRANSITION);
  }, []);

  /*
   * =====================================================
   * CONTEXT
   * =====================================================
   */

  const contextValue = useMemo<PageTransitionContextType>(
    () => ({
      startTransition,

      isTransitioning,
    }),
    [startTransition, isTransitioning],
  );

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}

      {isTransitioning && !shouldReduceMotion ? (
        <PageTransitionDissolve
          status={transition.status}
          variant={transition.variant}
          color={transition.color}
          onCovered={handleCovered}
          onFinished={handleFinished}
        />
      ) : null}
    </PageTransitionContext.Provider>
  );
}
