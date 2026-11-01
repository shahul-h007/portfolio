"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

function HashScrollHandler() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lenis) return;

    const performHashScroll = async (targetHash: string) => {
      // 1. Wait for web fonts to load
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore font loading errors
        }
      }

      // 2. Wait for page transition curtain if active
      if (typeof document !== "undefined") {
        const curtain = document.querySelector<HTMLElement>("[data-transition-curtain]");
        if (curtain && gsap.isTweening(curtain)) {
          await new Promise<void>((resolve) => {
            const onDone = () => {
              window.removeEventListener("page-transition-complete", onDone);
              resolve();
            };
            window.addEventListener("page-transition-complete", onDone, { once: true });
            setTimeout(() => {
              window.removeEventListener("page-transition-complete", onDone);
              resolve();
            }, 700);
          });
        }
      }

      // 3. Small frame wait for DOM / layout stability
      await new Promise((r) => setTimeout(r, 100));

      // Force Lenis and ScrollTrigger to re-measure full document dimensions on route transition
      lenis.resize();
      ScrollTrigger.refresh();
      lenis.resize();

      // 5. Scroll using Lenis
      try {
        const el = document.querySelector(targetHash);
        if (el) {
          lenis.scrollTo(targetHash, {
            duration: 1.2,
            offset: 0,
            immediate: false,
          });
        }
      } catch {
        // Fallback for querySelector invalid selectors
      }
    };

    // Case 1: Currently on Home Page
    if (pathname === "/") {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const returnToWork =
        typeof window !== "undefined" && sessionStorage.getItem("return_to_work");

      if (hash && hash !== "#") {
        performHashScroll(hash);
      } else if (returnToWork === "true") {
        sessionStorage.removeItem("return_to_work");
        window.history.replaceState(null, "", "/#work");
        performHashScroll("#work");
      } else if (prevPathnameRef.current && prevPathnameRef.current !== "/") {
        // Navigating back to home top (e.g. Logo click)
        lenis.scrollTo(0, { immediate: true });
      }
    }

    // Case 2: On Case Study Page (/work/*) and opened directly with a home hash
    if (pathname?.startsWith("/work")) {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const homeHashes = ["#work", "#skills", "#journey", "#about", "#contact", "#ventures"];
      if (hash && homeHashes.includes(hash)) {
        window.location.replace("/" + hash);
        return;
      }
    }

    // Listen to hashchange and popstate events (e.g. browser Back / Forward)
    const handlePopOrHashChange = () => {
      if (pathname === "/") {
        const hash = window.location.hash;
        const returnToWork = sessionStorage.getItem("return_to_work");
        if (hash && hash !== "#") {
          performHashScroll(hash);
        } else if (returnToWork === "true") {
          sessionStorage.removeItem("return_to_work");
          window.history.replaceState(null, "", "/#work");
          performHashScroll("#work");
        }
      } else if (pathname?.startsWith("/work")) {
        const hash = window.location.hash;
        const homeHashes = ["#work", "#skills", "#journey", "#about", "#contact", "#ventures"];
        if (hash && homeHashes.includes(hash)) {
          window.location.replace("/" + hash);
        }
      }
    };

    window.addEventListener("hashchange", handlePopOrHashChange);
    window.addEventListener("popstate", handlePopOrHashChange);

    prevPathnameRef.current = pathname;

    return () => {
      window.removeEventListener("hashchange", handlePopOrHashChange);
      window.removeEventListener("popstate", handlePopOrHashChange);
    };
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: disable Lenis smooth scrolling if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = l;
    setLenis(l);

    // Connect Lenis scroll events to GSAP ScrollTrigger
    l.on("scroll", ScrollTrigger.update);

    // Drive Lenis directly via gsap.ticker
    const tickerUpdate = (time: number) => {
      l.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after custom web fonts load
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      gsap.ticker.remove(tickerUpdate);
      l.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <HashScrollHandler />
      {children}
    </LenisContext.Provider>
  );
}
