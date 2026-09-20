"use client";

import { useEffect, useRef } from "react";

import ProjectPreviewHoverLabel from "./ProjectPreviewHoverLabel";
import ProjectPreviewImagePlane from "./ProjectPreviewImagePlane";

import type { PointerState } from "./projectPreviewTypes";

import type { RefObject } from "react";

export default function ProjectPreviewScene({
  src,
  anchorRef,
  hoverColor,
  onReady,
}: {
  src: string;

  anchorRef: RefObject<HTMLAnchorElement | null>;

  hoverColor: string;

  onReady: () => void;
}) {
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    active: false,
  });

  /*
   * Ett pointer-system for både
   * bildet OG View Case-labelen.
   */

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;

      pointerRef.current.y = event.clientY;

      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
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
  }, []);

  return (
    <>
      <ProjectPreviewImagePlane
        src={src}
        anchorRef={anchorRef}
        pointerRef={pointerRef}
        onReady={onReady}
      />

      <ProjectPreviewHoverLabel
        anchorRef={anchorRef}
        pointerRef={pointerRef}
        backgroundColor={hoverColor}
      />
    </>
  );
}
