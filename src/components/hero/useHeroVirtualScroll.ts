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

  const closeBottomInfo = useCallback(() => {
    if (!isBottomInfoOpenRef.current || bottomInfoClosingRef.current) {
      return;
    }

    bottomInfoClosingRef.current = true;

    setIsBottomInfoClosing(true);

    if (bottomInfoCloseTimeoutRef.current !== null) {
      window.clearTimeout(bottomInfoCloseTimeoutRef.current);
    }

    bottomInfoCloseTimeoutRef.current = window.setTimeout(() => {
      isBottomInfoOpenRef.current = false;

      setIsBottomInfoOpen(false);

      bottomInfoClosingRef.current = false;

      setIsBottomInfoClosing(false);

      bottomInfoCloseTimeoutRef.current = null;
    }, 1520);
  }, []);

  const openBottomInfo = useCallback(() => {
    if (bottomInfoCloseTimeoutRef.current !== null) {
      window.clearTimeout(bottomInfoCloseTimeoutRef.current);

      bottomInfoCloseTimeoutRef.current = null;
    }

    isBottomInfoOpenRef.current = true;

    bottomInfoClosingRef.current = false;

    setIsBottomInfoClosing(false);

    setIsBottomInfoOpen(true);
  }, []);

  useEffect(() => {
    return () => {
      if (bottomInfoCloseTimeoutRef.current !== null) {
        window.clearTimeout(bottomInfoCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showWorld || isTransitioning) {
      return;
    }

    virtualScrollPosition.current = virtualScroll.get();

    virtualScrollVelocity.current = 0;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const rawDelta = (time - lastTime) / 1000;

      lastTime = time;

      const delta = Math.min(
        Math.max(rawDelta, 0.001),
        1 / 30,
      );

      virtualScrollPosition.current +=
        virtualScrollVelocity.current * delta;

      const friction = Math.exp(-3.6 * delta);

      virtualScrollVelocity.current *= friction;

      if (Math.abs(virtualScrollVelocity.current) < 0.15) {
        virtualScrollVelocity.current = 0;
      }

      virtualScroll.set(virtualScrollPosition.current);

      scrollFrameRef.current =
        window.requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      let wheelDelta = event.deltaY;

      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        wheelDelta *= 16;
      }

      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
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

      virtualScrollVelocity.current += wheelDelta * 11.5;

      virtualScrollVelocity.current = THREE.MathUtils.clamp(
        virtualScrollVelocity.current,
        -1450,
        1450,
      );
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    scrollFrameRef.current =
      window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);

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