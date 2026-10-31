"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useIntro } from "@/context/IntroContext";

const INTRO_SESSION_KEY = "sh_portfolio_intro_seen_v2";

export default function Intro() {
  const { shouldPlayIntro, setIntroFinished } = useIntro();
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!shouldPlayIntro || !containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        setIntroFinished(true);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(INTRO_SESSION_KEY, "true");
          setIntroFinished(true);
        },
      });
      tlRef.current = tl;

      // 1. Text reveal (0.35s)
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );

      // 2. Subtitle reveal
      tl.fromTo(
        labelRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.25, ease: "power2.out" },
        "-=0.15"
      );

      // 3. Gold progress line (0.5s)
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power2.inOut" }
      );

      // 4. Curtain slides up via clip-path (0.5s, expo.out) — total <= 1.6s
      tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.5,
        ease: "expo.out",
      });
    },
    { scope: containerRef, dependencies: [shouldPlayIntro] }
  );

  const handleSkip = () => {
    if (!tlRef.current || !containerRef.current) return;
    tlRef.current.kill();

    gsap.to(containerRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.3,
      ease: "expo.out",
      onComplete: () => {
        sessionStorage.setItem(INTRO_SESSION_KEY, "true");
        setIntroFinished(true);
      },
    });
  };

  if (!shouldPlayIntro) return null;

  return (
    <aside
      ref={containerRef}
      onClick={handleSkip}
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-canvas select-none cursor-pointer"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-label="Site introduction"
    >
      <div className="flex flex-col items-center text-center">
        {/* Monogram initials */}
        <div
          ref={textRef}
          className="font-display text-7xl md:text-9xl font-extrabold tracking-tighter text-ink will-change-transform"
        >
          SH
        </div>

        {/* Thin gold progress line */}
        <div className="w-36 h-[1px] bg-white/10 relative overflow-hidden mt-6">
          <div
            ref={lineRef}
            className="h-full w-full bg-gold origin-left will-change-transform"
          />
        </div>

        {/* Telemetry label */}
        <div
          ref={labelRef}
          className="font-mono text-[10px] tracking-[0.25em] text-muted uppercase mt-4"
        >
          ENGINEERED EXPERIENCES
        </div>
      </div>

      {/* Skippable prompt */}
      <span className="absolute bottom-8 font-mono text-[9px] tracking-widest text-muted/50 uppercase">
        Click to skip
      </span>
    </aside>
  );
}
