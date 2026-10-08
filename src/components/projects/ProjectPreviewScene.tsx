"use client";

import { useEffect, useRef } from "react";

import ProjectPreviewHoverLabel from "./ProjectPreviewHoverLabel";
import ProjectPreviewImagePlane from "./ProjectPreviewImagePlane";

import type { PointerState, SharedPointerRef } from "./projectPreviewTypes";

import type { RefObject } from "react";

type ProjectPreviewSceneProps = {
  src: string;

  anchorRef: RefObject<HTMLAnchorElement | null>;

  hoverColor: string;

  onReady: () => void;

  pointerRef?: SharedPointerRef;

  compact?: boolean;
};

export default function ProjectPreviewScene({
  src,
  anchorRef,
  hoverColor,
  onReady,
  pointerRef,
  compact = false,
}: ProjectPreviewSceneProps) {
  /*
   * =====================================================
   * FALLBACK POINTER
   * =====================================================
   *
   * Hvis komponenten brukes alene,
   * fungerer den fortsatt akkurat som før.
   */

  const localPointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    active: false,
  });

  const activePointerRef = pointerRef ?? localPointerRef;

  /*
   * =====================================================
   * POINTER EVENTS
   * =====================================================
   *
   * Grid-versjonen sender allerede inn shared pointer.
   * Da oppretter vi IKKE en ekstra listener.
   */

  useEffect(() => {
    if (pointerRef) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      localPointerRef.current.x = event.clientX;

      localPointerRef.current.y = event.clientY;

      localPointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      localPointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, [pointerRef]);

  return (
    <>
      <ProjectPreviewImagePlane
        src={src}
        anchorRef={anchorRef}
        pointerRef={activePointerRef}
        onReady={onReady}
      />

      <ProjectPreviewHoverLabel
        anchorRef={anchorRef}
        pointerRef={activePointerRef}
        backgroundColor={hoverColor}
        compact={compact}
      />
    </>
  );
}
