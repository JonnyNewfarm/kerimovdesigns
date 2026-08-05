"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

const SmoothScrollerContext = createContext<Lenis | null>(null);

export const useSmoothScroller = () => {
  return useContext(SmoothScrollerContext);
};

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const scroller = new Lenis({
      duration: 0.9,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    setLenis(scroller);

    let frameId: number;

    const raf = (time: number) => {
      scroller.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      scroller.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <SmoothScrollerContext.Provider value={lenis}>
      {children}
    </SmoothScrollerContext.Provider>
  );
}
