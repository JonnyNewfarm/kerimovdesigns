"use client";

import { useEffect, useState } from "react";

export default function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    setIsMdUp(mediaQuery.matches);

    function handleChange(event: MediaQueryListEvent) {
      setIsMdUp(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMdUp;
}
