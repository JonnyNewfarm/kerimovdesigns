"use client";

import gsap from "gsap";
import { useEffect, useRef, useState, type MutableRefObject } from "react";

type Props = {
  active: boolean;
  hasMultipleMedia: boolean;
  isOverImage: MutableRefObject<((x: number, y: number) => boolean) | null>;
  initialMousePosition: MutableRefObject<{ x: number; y: number } | null>;
  menuHovered?: boolean;
};

const FOLLOW_SPEED = 10;
const MAX_TILT_DEG = 2.5;
const MAX_EXTRA_SPACING_EM = 0.35;
const SPREAD_AT_SPEED = 15;
const KINETIC_DAMPING = 11;
const BASE_SPACING_EM = 0.11;

type CursorLabel = "RETURN" | "NEXT";

export default function ProjectCursor({
  active,
  hasMultipleMedia,
  isOverImage,
  initialMousePosition,
  menuHovered = false,
}: Props) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const kineticRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const squareRef = useRef<HTMLSpanElement>(null);

  const [label, setLabel] = useState<CursorLabel>("RETURN");

  const latestRef = useRef({
    hasMultipleMedia,
    isOverImage,
  });

  latestRef.current = {
    hasMultipleMedia,
    isOverImage,
  };

  // RETURN / NEXT TEXT REVEAL
  useEffect(() => {
    const text = textRef.current;

    if (!text || !active || menuHovered) return;

    gsap.fromTo(
      text,
      {
        y: 7,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.42,
        ease: "expo.out",
        overwrite: true,
      },
    );

    return () => {
      gsap.killTweensOf(text);
    };
  }, [label, active, menuHovered]);

  // SMOOTH TRANSITION BETWEEN TEXT AND SQUARE
  useEffect(() => {
    const text = textRef.current;
    const square = squareRef.current;

    if (!text || !square || !active) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const duration = reducedMotion ? 0 : 0.3;

    if (menuHovered) {
      gsap.to(text, {
        autoAlpha: 0,
        scale: 0.75,
        y: 0,
        duration: reducedMotion ? 0 : 0.22,
        ease: "power2.inOut",
        overwrite: true,
      });

      gsap.to(square, {
        autoAlpha: 1,
        scale: 1,
        duration,
        delay: reducedMotion ? 0 : 0.04,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      gsap.to(square, {
        autoAlpha: 0,
        scale: 0.35,
        duration: reducedMotion ? 0 : 0.22,
        ease: "power2.inOut",
        overwrite: true,
      });

      gsap.to(text, {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: reducedMotion ? 0 : 0.38,
        delay: reducedMotion ? 0 : 0.04,
        ease: "expo.out",
        overwrite: true,
      });
    }

    return () => {
      gsap.killTweensOf(text);
      gsap.killTweensOf(square);
    };
  }, [menuHovered, active]);

  useEffect(() => {
    if (!active) return;

    const cursor = cursorRef.current;
    const kinetic = kineticRef.current;
    const press = pressRef.current;
    const text = textRef.current;

    if (!cursor || !kinetic || !press || !text) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!finePointer.matches) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const section = cursor.closest("section");

    section?.classList.add("project-kinetic-cursor-active");

    gsap.set(cursor, {
      autoAlpha: 0,
    });

    let initialized = false;
    let visible = false;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let tilt = 0;
    let spacing = 0;

    let animationFrame = 0;
    let previousFrameTime = 0;

    let previousLabel: CursorLabel | null = null;

    const updateLabel = () => {
      if (!initialized) return;

      const next: CursorLabel =
        latestRef.current.hasMultipleMedia &&
        latestRef.current.isOverImage.current?.(targetX, targetY)
          ? "NEXT"
          : "RETURN";

      if (next !== previousLabel) {
        previousLabel = next;
        setLabel(next);
      }
    };

    const animateCursor = (time: number) => {
      animationFrame = 0;

      const delta = previousFrameTime
        ? Math.max(1, Math.min(50, time - previousFrameTime))
        : 1000 / 60;

      previousFrameTime = time;

      const seconds = delta / 1000;

      const follow = reducedMotion ? 1 : 1 - Math.exp(-FOLLOW_SPEED * seconds);

      const lastX = currentX;
      const lastY = currentY;

      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;

      const motionX = (currentX - lastX) / 60 / seconds;
      const motionY = (currentY - lastY) / 60 / seconds;

      const speed = Math.hypot(motionX, motionY);

      const strength = reducedMotion ? 0 : Math.min(speed / SPREAD_AT_SPEED, 1);

      const desiredTilt = reducedMotion
        ? 0
        : Math.max(
            -MAX_TILT_DEG,
            Math.min(MAX_TILT_DEG, motionX * 0.22 + motionY * 0.04),
          );

      const desiredSpacing = MAX_EXTRA_SPACING_EM * strength;

      const damping = reducedMotion
        ? 1
        : 1 - Math.exp(-KINETIC_DAMPING * seconds);

      tilt += (desiredTilt - tilt) * damping;
      spacing += (desiredSpacing - spacing) * damping;

      const positionSettled =
        Math.abs(targetX - currentX) < 0.1 &&
        Math.abs(targetY - currentY) < 0.1;

      const kineticSettled =
        Math.abs(tilt) < 0.015 && Math.abs(spacing) < 0.0003;

      if (positionSettled) {
        currentX = targetX;
        currentY = targetY;
      }

      if (kineticSettled && speed < 0.05) {
        tilt = 0;
        spacing = 0;
      }

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      kinetic.style.transform = `rotate(${tilt}deg)`;

      text.style.letterSpacing = `${BASE_SPACING_EM + spacing}em`;

      updateLabel();

      if (visible && (!positionSettled || !kineticSettled)) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      } else {
        previousFrameTime = 0;
      }
    };

    const startFrame = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateCursor);
      }
    };

    const show = () => {
      if (visible || !initialized) return;

      visible = true;

      gsap.to(cursor, {
        autoAlpha: 1,
        duration: reducedMotion ? 0 : 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const hide = () => {
      if (!visible) return;

      visible = false;

      gsap.to(cursor, {
        autoAlpha: 0,
        duration: reducedMotion ? 0 : 0.2,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const updatePosition = (x: number, y: number) => {
      targetX = x;
      targetY = y;

      if (!initialized) {
        initialized = true;

        currentX = x;
        currentY = y;

        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      updateLabel();
      startFrame();
      show();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType === "touch") {
        return;
      }

      updatePosition(event.clientX, event.clientY);
    };

    const onMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        event.pointerType === "touch" ||
        event.button !== 0
      ) {
        return;
      }

      updatePosition(event.clientX, event.clientY);

      gsap.to(press, {
        scale: 0.82,
        duration: reducedMotion ? 0 : 0.14,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        event.pointerType === "touch" ||
        event.button !== 0
      ) {
        return;
      }

      gsap.to(press, {
        scale: 1,
        duration: reducedMotion ? 0 : 0.33,
        ease: "expo.out",
        overwrite: true,
      });
    };

    const onCancel = () => {
      gsap.to(press, {
        scale: 1,
        duration: reducedMotion ? 0 : 0.2,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        hide();
      }
    };

    window.addEventListener("pointermove", onPointerMove, true);
    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointerup", onPointerUp, true);
    window.addEventListener("pointercancel", onCancel, true);

    document.addEventListener("mouseout", onMouseOut, true);

    window.addEventListener("blur", hide);

    const initial = initialMousePosition.current;

    if (initial) {
      updatePosition(initial.x, initial.y);
    }

    let labelFrame = 0;

    const pollLabel = () => {
      updateLabel();

      labelFrame = window.requestAnimationFrame(pollLabel);
    };

    labelFrame = window.requestAnimationFrame(pollLabel);

    return () => {
      section?.classList.remove("project-kinetic-cursor-active");

      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(labelFrame);

      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onCancel, true);

      document.removeEventListener("mouseout", onMouseOut, true);

      window.removeEventListener("blur", hide);

      gsap.killTweensOf(cursor);
      gsap.killTweensOf(press);
    };
  }, [active, initialMousePosition]);

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .project-kinetic-cursor-active,
          .project-kinetic-cursor-active * {
            cursor: none !important;
          }
        }
      `}</style>

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference opacity-0"
        style={{
          transform: "translate3d(-200px, -200px, 0)",
          willChange: "transform, opacity",
        }}
      >
        <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
          <div ref={kineticRef} className="origin-center will-change-transform">
            <div
              ref={pressRef}
              className="relative flex items-center justify-center origin-center will-change-transform"
            >
              <span
                ref={textRef}
                className="block whitespace-nowrap font-sans text-[14px] font-semibold uppercase leading-none tracking-[0.11em] text-white will-change-transform"
              >
                {label}
              </span>

              <span
                ref={squareRef}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 bg-white opacity-0"
                style={{
                  scale: 0.35,
                  willChange: "transform, opacity",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
