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

  const virtualScrollPosition = useRef(0);
  const virtualScrollVelocity = useRef(0);

  const scrollFrameRef = useRef<number | null>(null);

  const [isBottomInfoOpen, setIsBottomInfoOpen] = useState(true);
  const [isBottomInfoClosing, setIsBottomInfoClosing] = useState(false);

  const isBottomInfoOpenRef = useRef(true);
  const bottomInfoClosingRef = useRef(false);

  const bottomInfoCloseTimeoutRef = useRef<number | null>(null);

  /*
   * =========================================================
   * TOUCH STATE
   * =========================================================
   */

  const touchLastYRef = useRef(0);
  const touchLastTimeRef = useRef(0);
  const isTouchingRef = useRef(false);

  /*
   * =========================================================
   * BOTTOM INFO
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

    bottomInfoCloseTimeoutRef.current = window.setTimeout(
      () => {
        isBottomInfoOpenRef.current = false;

        setIsBottomInfoOpen(false);

        bottomInfoClosingRef.current = false;

        setIsBottomInfoClosing(false);

        bottomInfoCloseTimeoutRef.current = null;
      },
      1520,
    );
  }, []);

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
   * CLEANUP TIMEOUT
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

    virtualScrollPosition.current = virtualScroll.get();
    virtualScrollVelocity.current = 0;

    let lastTime = performance.now();

    /*
     * =======================================================
     * ANIMATION / MOMENTUM
     * =======================================================
     */

    const animate = (time: number) => {
      const rawDelta = (time - lastTime) / 1000;

      lastTime = time;

      const delta = Math.min(
        Math.max(rawDelta, 0.001),
        1 / 30,
      );

      /*
       * På touch styrer fingeren scrollen direkte mens
       * man swiper.
       *
       * Når fingeren slippes fortsetter velocity som momentum.
       */
      if (!isTouchingRef.current) {
        virtualScrollPosition.current +=
          virtualScrollVelocity.current * delta;

        const friction = Math.exp(-3.6 * delta);

        virtualScrollVelocity.current *= friction;

        if (
          Math.abs(virtualScrollVelocity.current) < 0.15
        ) {
          virtualScrollVelocity.current = 0;
        }
      }

      virtualScroll.set(
        virtualScrollPosition.current,
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
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ) {
        wheelDelta *= 16;
      }

      if (
        event.deltaMode === WheelEvent.DOM_DELTA_PAGE
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

      virtualScrollVelocity.current +=
        wheelDelta * 11.5;

      virtualScrollVelocity.current =
        THREE.MathUtils.clamp(
          virtualScrollVelocity.current,
          -1450,
          1450,
        );
    };

    /*
     * =======================================================
     * MOBILE TOUCH START
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
       * Stopper gammel momentum med en gang brukeren
       * tar på skjermen igjen.
       */
      virtualScrollVelocity.current = 0;
    };

    /*
     * =======================================================
     * MOBILE TOUCH MOVE
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
       * Finger opp:
       *
       * previousY = 500
       * currentY  = 480
       *
       * deltaY = +20
       *
       * Altså samme retning som wheel nedover.
       */
      let deltaY =
        touchLastYRef.current - currentY;

      deltaY = THREE.MathUtils.clamp(
        deltaY,
        -55,
        55,
      );

      /*
       * Hvor mye selve verden beveger seg per pixel finger.
       *
       * Øk hvis mobilen føles for treg.
       */
      const TOUCH_DISTANCE_MULTIPLIER = 1.65;

      virtualScrollPosition.current +=
        deltaY * TOUCH_DISTANCE_MULTIPLIER;

      /*
       * Beregn finger-hastigheten så vi kan fortsette
       * smooth etter touchEnd.
       */
      const deltaTime = Math.max(
        (currentTime -
          touchLastTimeRef.current) /
          1000,
        0.001,
      );

      const velocity =
        (deltaY *
          TOUCH_DISTANCE_MULTIPLIER) /
        deltaTime;

      virtualScrollVelocity.current =
        THREE.MathUtils.clamp(
          velocity,
          -1450,
          1450,
        );

      if (Math.abs(deltaY) > 2) {
        closeBottomInfo();
      }

      touchLastYRef.current = currentY;
      touchLastTimeRef.current = currentTime;

      /*
       * Oppdater umiddelbart under touch.
       *
       * Dette gjør at verden sitter fast i fingeren
       * i stedet for å føles laggy.
       */
      virtualScroll.set(
        virtualScrollPosition.current,
      );
    };

    /*
     * =======================================================
     * MOBILE TOUCH END
     * =======================================================
     */

    const handleTouchEnd = () => {
      isTouchingRef.current = false;

      /*
       * Vi lar virtualScrollVelocity stå.
       *
       * animate() tar over her og gir momentum +
       * friction.
       */
    };

    const handleTouchCancel = () => {
      isTouchingRef.current = false;

      virtualScrollVelocity.current = 0;
    };

    /*
     * =======================================================
     * EVENT LISTENERS
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