"use client";

import { useEffect, useState } from "react";

import type { LayoutMode } from "./projectTypes";

import { getBreakpointWidth } from "./projectUtils";

export default function useResponsiveLayout() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(null);
  const [breakpointWidth, setBreakpointWidth] = useState(0);

  useEffect(() => {
    let frameId: number | null = null;

    const updateLayout = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        const windowWidth = window.innerWidth;

        const nextLayoutMode: LayoutMode =
          windowWidth >= 1024 ? "desktop" : "mobile";

        const nextBreakpointWidth =
          getBreakpointWidth(windowWidth);

        setLayoutMode((currentMode) => {
          if (currentMode === nextLayoutMode) {
            return currentMode;
          }

          return nextLayoutMode;
        });

        setBreakpointWidth((currentWidth) => {
          if (currentWidth === nextBreakpointWidth) {
            return currentWidth;
          }

          return nextBreakpointWidth;
        });

        frameId = null;
      });
    };

    updateLayout();

    window.addEventListener("resize", updateLayout, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateLayout);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return {
    layoutMode,
    breakpointWidth,
  };
}