"use client";

import { useEffect } from "react";

export default function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const scrollY = window.scrollY;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyTouchAction = document.body.style.touchAction;

    const originalHtmlOverflow =
      document.documentElement.style.overflow;

    const originalHtmlOverscrollBehavior =
      document.documentElement.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow =
        originalHtmlOverflow;

      document.documentElement.style.overscrollBehavior =
        originalHtmlOverscrollBehavior;

      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.touchAction = originalBodyTouchAction;

      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}