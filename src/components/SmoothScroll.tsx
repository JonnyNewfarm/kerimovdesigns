"use client";

import { useEffect, useContext, createContext, useState } from "react";
import Lenis from "lenis";

const SmoothScrollerContext = createContext<Lenis | null>(null);

export const useSmoothScroller = () => useContext(SmoothScrollerContext);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisRef, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const scroller = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });

    setLenis(scroller);

    let frameId = 0;

    const raf = (time: number) => {
      scroller.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      scroller.destroy();
    };
  }, []);

  return (
    <SmoothScrollerContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollerContext.Provider>
  );
}
