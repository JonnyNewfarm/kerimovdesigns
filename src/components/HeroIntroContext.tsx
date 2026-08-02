"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type HeroIntroContextValue = {
  introExited: boolean;
  setIntroExited: (value: boolean) => void;
};

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null);

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const [introExited, setIntroExited] = useState(false);

  return (
    <HeroIntroContext.Provider
      value={{
        introExited,
        setIntroExited,
      }}
    >
      {children}
    </HeroIntroContext.Provider>
  );
}

export function useHeroIntro() {
  const context = useContext(HeroIntroContext);

  if (!context) {
    throw new Error("useHeroIntro must be used inside HeroIntroProvider");
  }

  return context;
}
