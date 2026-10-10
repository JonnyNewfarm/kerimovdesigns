"use client";

import { useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const PIXELS_PER_SECTION = 620;

export default function useHeroVirtualScroll({
  showWorld,
  isTransitioning,
}: {
  showWorld: boolean;
  isTransitioning: boolean;
}) {
  const virtualScroll = useMotionValue(0);

 

  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);

  const velocityRef = useRef(0);

  const scrollFrameRef = useRef<number | null>(null);

  

  const isTouchingRef = useRef(false);

  const touchLastYRef = useRef(0);
  const touchLastTimeRef = useRef(0);


  const [isBottomInfoOpen, setIsBottomInfoOpen] = useState(true);

  const [isBottomInfoClosing, setIsBottomInfoClosing] = useState(false);

  const isBottomInfoOpenRef = useRef(true);
  const bottomInfoClosingRef = useRef(false);

  const bottomInfoCloseTimeoutRef = useRef<number | null>(null);


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



  const scrollToSection = useCallback(
    (sectionIndex: number) => {
    

      velocityRef.current = 0;
      isTouchingRef.current = false;

   
      targetScrollRef.current =
        sectionIndex * PIXELS_PER_SECTION;

      closeBottomInfo();
    },
    [closeBottomInfo],
  );

 

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

 
    const TOUCH_FOLLOW = 18;

    const FREE_FOLLOW = 10;

    const TOUCH_MULTIPLIER = 1.18;

   
    const MOMENTUM_FRICTION = 4.4;

    const MAX_VELOCITY = 1250;

   

    const animate = (time: number) => {
      const rawDelta =
        (time - lastFrameTime) / 1000;

      lastFrameTime = time;

      const delta = THREE.MathUtils.clamp(
        rawDelta,
        0.001,
        1 / 30,
      );

     

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

    

      const followSpeed = isTouchingRef.current
        ? TOUCH_FOLLOW
        : FREE_FOLLOW;

      currentScrollRef.current = THREE.MathUtils.damp(
        currentScrollRef.current,
        targetScrollRef.current,
        followSpeed,
        delta,
      );

    
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

     

      velocityRef.current +=
        wheelDelta * 10.5;

      velocityRef.current =
        THREE.MathUtils.clamp(
          velocityRef.current,
          -1450,
          1450,
        );
    };

   

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;

   

      if (target instanceof HTMLElement) {
        const tagName = target.tagName;

        const isEditable =
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT" ||
          target.isContentEditable;

        if (isEditable) {
          return;
        }
      }

      let direction = 0;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          direction = 1;
          break;

        case "ArrowUp":
        case "ArrowLeft":
          direction = -1;
          break;

        default:
          return;
      }

      event.preventDefault();

     

      velocityRef.current = 0;

     

      const currentSection = Math.round(
        targetScrollRef.current /
          PIXELS_PER_SECTION,
      );

      const nextSection =
        currentSection + direction;

      targetScrollRef.current =
        nextSection * PIXELS_PER_SECTION;

      closeBottomInfo();
    };

   

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

     

      velocityRef.current = 0;
    };

  

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

      

      let deltaY =
        touchLastYRef.current - currentY;

  
      deltaY = THREE.MathUtils.clamp(
        deltaY,
        -60,
        60,
      );

      const scrollDelta =
        deltaY * TOUCH_MULTIPLIER;

   
      targetScrollRef.current += scrollDelta;

     
      const deltaTime = Math.max(
        (currentTime -
          touchLastTimeRef.current) /
          1000,
        0.008,
      );

      const instantaneousVelocity =
        scrollDelta / deltaTime;

   

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

    

    const handleTouchEnd = () => {
      isTouchingRef.current = false;

    };

    const handleTouchCancel = () => {
      isTouchingRef.current = false;

      velocityRef.current = 0;
    };

   

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      },
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
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

   
    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel,
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown,
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

    scrollToSection,

    isBottomInfoOpen,
    isBottomInfoClosing,

    openBottomInfo,
  };
}