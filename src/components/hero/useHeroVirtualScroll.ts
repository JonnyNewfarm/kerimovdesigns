"use client";

import { useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function useHeroVirtualScroll({
  showWorld,
  isTransitioning,
}: {
  showWorld: boolean;
  isTransitioning: boolean;
}) {
  const virtualScroll = useMotionValue(0);

  /*
   * =========================================================
   * SCROLL STATE
   * =========================================================
   */

  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);

  const velocityRef = useRef(0);

  const scrollFrameRef = useRef<number | null>(null);

  /*
   * =========================================================
   * TOUCH STATE
   * =========================================================
   */

  const isTouchingRef = useRef(false);

  const touchLastYRef = useRef(0);
  const touchLastTimeRef = useRef(0);

  /*
   * =========================================================
   * BOTTOM INFO
   * =========================================================
   */

  const [isBottomInfoOpen, setIsBottomInfoOpen] =
    useState(true);

  const [
    isBottomInfoClosing,
    setIsBottomInfoClosing,
  ] = useState(false);

  const isBottomInfoOpenRef = useRef(true);
  const bottomInfoClosingRef = useRef(false);

  const bottomInfoCloseTimeoutRef =
    useRef<number | null>(null);

  /*
   * =========================================================
   * CLOSE BOTTOM INFO
   * =========================================================
   */

  const closeBottomInfo = useCallback(() => {
    if (
      !isBottomInfoOpenRef.current ||
      bottomInfoClosingRef.current
    ) {
      return;
    }

    bottomInfoClosingRef.current = true;

    setIsBottomInfoClosing(true);

    if (bottomInfoCloseTimeoutRef.current !== null) {
      window.clearTimeout(
        bottomInfoCloseTimeoutRef.current,
      );
    }

    bottomInfoCloseTimeoutRef.current =
      window.setTimeout(() => {
        isBottomInfoOpenRef.current = false;

        setIsBottomInfoOpen(false);

        bottomInfoClosingRef.current = false;

        setIsBottomInfoClosing(false);

        bottomInfoCloseTimeoutRef.current = null;
      }, 1520);
  }, []);

  /*
   * =========================================================
   * OPEN BOTTOM INFO
   * =========================================================
   */

  const openBottomInfo = useCallback(() => {
    if (bottomInfoCloseTimeoutRef.current !== null) {
      window.clearTimeout(
        bottomInfoCloseTimeoutRef.current,
      );

      bottomInfoCloseTimeoutRef.current = null;
    }

    isBottomInfoOpenRef.current = true;
    bottomInfoClosingRef.current = false;

    setIsBottomInfoClosing(false);
    setIsBottomInfoOpen(true);
  }, []);

  /*
   * =========================================================
   * TIMEOUT CLEANUP
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (bottomInfoCloseTimeoutRef.current !== null) {
        window.clearTimeout(
          bottomInfoCloseTimeoutRef.current,
        );
      }
    };
  }, []);

  /*
   * =========================================================
   * VIRTUAL SCROLL
   * =========================================================
   */

  useEffect(() => {
    if (!showWorld || isTransitioning) {
      return;
    }

    const initialScroll = virtualScroll.get();

    currentScrollRef.current = initialScroll;
    targetScrollRef.current = initialScroll;

    velocityRef.current = 0;

    let lastFrameTime = performance.now();

    /*
     * =======================================================
     * TUNING
     * =======================================================
     */

    // Hvor tett verden følger fingeren.
    //
    // Høyere = mer direkte.
    // Lavere = mer svevende.
    const TOUCH_FOLLOW = 18;

    // Smoothness etter man slipper.
    const FREE_FOLLOW = 10;

    // Hvor mye finger-bevegelse flytter verden.
    const TOUCH_MULTIPLIER = 1.18;

    // Hvor lenge momentum varer.
    //
    // Lavere = glir lenger.
    // Høyere = stopper raskere.
    const MOMENTUM_FRICTION = 4.4;

    // Maks fart etter swipe.
    const MAX_VELOCITY = 1250;

    /*
     * =======================================================
     * FRAME LOOP
     * =======================================================
     */

    const animate = (time: number) => {
      const rawDelta =
        (time - lastFrameTime) / 1000;

      lastFrameTime = time;

      const delta = THREE.MathUtils.clamp(
        rawDelta,
        0.001,
        1 / 30,
      );

      /*
       * Når fingeren ikke er på skjermen fortsetter
       * targetScroll med momentum.
       */

      if (!isTouchingRef.current) {
        targetScrollRef.current +=
          velocityRef.current * delta;

        velocityRef.current *= Math.exp(
          -MOMENTUM_FRICTION * delta,
        );

        if (Math.abs(velocityRef.current) < 0.5) {
          velocityRef.current = 0;
        }
      }

      /*
       * Nå følger actual scroll targetScroll smooth.
       *
       * Dette er forskjellen fra den gamle løsningen.
       *
       * Vi skriver ikke lenger touch-eventet direkte
       * til MotionValue.
       */

      const followSpeed = isTouchingRef.current
        ? TOUCH_FOLLOW
        : FREE_FOLLOW;

      currentScrollRef.current =
        THREE.MathUtils.damp(
          currentScrollRef.current,
          targetScrollRef.current,
          followSpeed,
          delta,
        );

      /*
       * Unngå at damp aldri kommer helt frem.
       */

      if (
        Math.abs(
          targetScrollRef.current -
            currentScrollRef.current,
        ) < 0.001
      ) {
        currentScrollRef.current =
          targetScrollRef.current;
      }

      virtualScroll.set(
        currentScrollRef.current,
      );

      scrollFrameRef.current =
        window.requestAnimationFrame(animate);
    };

    /*
     * =======================================================
     * DESKTOP WHEEL
     * =======================================================
     */

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      let wheelDelta = event.deltaY;

      if (
        event.deltaMode ===
        WheelEvent.DOM_DELTA_LINE
      ) {
        wheelDelta *= 16;
      }

      if (
        event.deltaMode ===
        WheelEvent.DOM_DELTA_PAGE
      ) {
        wheelDelta *= window.innerHeight;
      }

      wheelDelta = THREE.MathUtils.clamp(
        wheelDelta,
        -110,
        110,
      );

      if (Math.abs(wheelDelta) > 4) {
        closeBottomInfo();
      }

      /*
       * Wheel gir velocity i stedet for å hoppe
       * scroll-position direkte.
       */

      velocityRef.current +=
        wheelDelta * 10.5;

      velocityRef.current =
        THREE.MathUtils.clamp(
          velocityRef.current,
          -1450,
          1450,
        );
    };

    /*
     * =======================================================
     * TOUCH START
     * =======================================================
     */

    const handleTouchStart = (
      event: TouchEvent,
    ) => {
      if (event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];

      isTouchingRef.current = true;

      touchLastYRef.current = touch.clientY;
      touchLastTimeRef.current = performance.now();

      /*
       * Kill gammel inertia når man tar tak igjen.
       */

      velocityRef.current = 0;
    };

    /*
     * =======================================================
     * TOUCH MOVE
     * =======================================================
     */

    const handleTouchMove = (
      event: TouchEvent,
    ) => {
      if (
        !isTouchingRef.current ||
        event.touches.length !== 1
      ) {
        return;
      }

      event.preventDefault();

      const touch = event.touches[0];

      const currentY = touch.clientY;
      const currentTime = performance.now();

      /*
       * Positiv delta = finger beveger seg opp.
       */

      let deltaY =
        touchLastYRef.current - currentY;

      /*
       * Ignorer insane touch-event jumps.
       */

      deltaY = THREE.MathUtils.clamp(
        deltaY,
        -60,
        60,
      );

      const scrollDelta =
        deltaY * TOUCH_MULTIPLIER;

      /*
       * Viktig:
       *
       * Endrer TARGET.
       *
       * Ikke actual virtualScroll.
       */

      targetScrollRef.current += scrollDelta;

      /*
       * Beregn velocity for inertia etter touchend.
       */

      const deltaTime = Math.max(
        (currentTime -
          touchLastTimeRef.current) /
          1000,
        0.008,
      );

      const instantaneousVelocity =
        scrollDelta / deltaTime;

      /*
       * Raw touch velocity er noisy på mobile Safari.
       *
       * Derfor smoother vi velocity før vi bruker den
       * som momentum.
       */

      velocityRef.current =
        THREE.MathUtils.lerp(
          velocityRef.current,
          THREE.MathUtils.clamp(
            instantaneousVelocity,
            -MAX_VELOCITY,
            MAX_VELOCITY,
          ),
          0.16,
        );

      if (Math.abs(deltaY) > 1.5) {
        closeBottomInfo();
      }

      touchLastYRef.current = currentY;
      touchLastTimeRef.current = currentTime;
    };

    /*
     * =======================================================
     * TOUCH END
     * =======================================================
     */

    const handleTouchEnd = () => {
      isTouchingRef.current = false;

      /*
       * velocityRef beholdes.
       *
       * Frame loop tar over og lager inertia.
       */
    };

    const handleTouchCancel = () => {
      isTouchingRef.current = false;

      velocityRef.current = 0;
    };

    /*
     * =======================================================
     * EVENTS
     * =======================================================
     */

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      },
    );

    window.addEventListener(
      "touchstart",
      handleTouchStart,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      {
        passive: false,
      },
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "touchcancel",
      handleTouchCancel,
      {
        passive: true,
      },
    );

    scrollFrameRef.current =
      window.requestAnimationFrame(animate);

    /*
     * =======================================================
     * CLEANUP
     * =======================================================
     */

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel,
      );

      window.removeEventListener(
        "touchstart",
        handleTouchStart,
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove,
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd,
      );

      window.removeEventListener(
        "touchcancel",
        handleTouchCancel,
      );

      isTouchingRef.current = false;

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(
          scrollFrameRef.current,
        );

        scrollFrameRef.current = null;
      }
    };
  }, [
    showWorld,
    isTransitioning,
    virtualScroll,
    closeBottomInfo,
  ]);

  return {
    virtualScroll,
    isBottomInfoOpen,
    isBottomInfoClosing,
    openBottomInfo,
  };
}