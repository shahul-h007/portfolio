"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface IntroContextType {
  introFinished: boolean;
  setIntroFinished: (finished: boolean) => void;
  shouldPlayIntro: boolean;
}

const IntroContext = createContext<IntroContextType>({
  introFinished: false,
  setIntroFinished: () => {},
  shouldPlayIntro: false,
});

export const useIntro = () => useContext(IntroContext);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introFinished, setIntroFinished] = useState(false);
  const [shouldPlayIntro, setShouldPlayIntro] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasSeen = sessionStorage.getItem("sh_portfolio_intro_seen_v2");
    const isSkipParam = window.location.search.includes("skip_intro=true");

    if (prefersReducedMotion || hasSeen || isSkipParam) {
      setIntroFinished(true);
      setShouldPlayIntro(false);
    } else {
      setShouldPlayIntro(true);
    }
  }, []);

  return (
    <IntroContext.Provider
      value={{ introFinished, setIntroFinished, shouldPlayIntro }}
    >
      {children}
    </IntroContext.Provider>
  );
}
