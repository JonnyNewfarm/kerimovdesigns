"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { usePageTransition } from "../ClientPageTransitionWrapper";

type PageTransitionGateProps = {
  children: ReactNode;
  className?: string;
};

export default function PageTransitionGate({
  children,
  className = "",
}: PageTransitionGateProps) {
  const { isTransitioning } = usePageTransition();

  const [hasEntered, setHasEntered] = useState(false);

  const firstFrameRef = useRef<number | null>(null);
  const secondFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasEntered || isTransitioning) {
      return;
    }

    firstFrameRef.current = window.requestAnimationFrame(() => {
      secondFrameRef.current = window.requestAnimationFrame(() => {
        setHasEntered(true);
      });
    });

    return () => {
      if (firstFrameRef.current !== null) {
        window.cancelAnimationFrame(firstFrameRef.current);
      }

      if (secondFrameRef.current !== null) {
        window.cancelAnimationFrame(secondFrameRef.current);
      }
    };
  }, [hasEntered, isTransitioning]);

  return <div className={className}>{hasEntered ? children : null}</div>;
}
