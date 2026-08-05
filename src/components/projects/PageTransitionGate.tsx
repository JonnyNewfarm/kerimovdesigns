"use client";

import { useEffect, useState, type ReactNode } from "react";

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

  useEffect(() => {
    if (!isTransitioning) {
      setHasEntered(true);
    }
  }, [isTransitioning]);

  return <div className={className}>{hasEntered ? children : null}</div>;
}
