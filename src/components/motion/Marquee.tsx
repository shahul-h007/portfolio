"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // duration in seconds for 1 full cycle
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

export default function Marquee({
  children,
  speed = 25,
  className = "",
  pauseOnHover = true,
  reverse = false,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fromX = reverse ? -50 : 0;
        const toX = reverse ? 0 : -50;

        const tween = gsap.fromTo(
          track,
          { xPercent: fromX },
          {
            xPercent: toX,
            ease: "none",
            duration: speed,
            repeat: -1,
          }
        );

        // React slightly to scroll velocity
        let decayTween: gsap.core.Tween | null = null;
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            if (velocity > 50) {
              const boost = Math.min(velocity / 300, 2.5);
              tween.timeScale(1 + boost);

              if (decayTween) decayTween.kill();
              decayTween = gsap.to(tween, {
                timeScale: 1,
                duration: 0.8,
                ease: "power2.out",
              });
            }
          },
        });

        // Pause on hover
        let handleMouseEnter: (() => void) | null = null;
        let handleMouseLeave: (() => void) | null = null;

        if (pauseOnHover) {
          handleMouseEnter = () => {
            gsap.to(tween, { timeScale: 0, duration: 0.3 });
          };
          handleMouseLeave = () => {
            gsap.to(tween, { timeScale: 1, duration: 0.3 });
          };

          container.addEventListener("mouseenter", handleMouseEnter);
          container.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
          st.kill();
          if (decayTween) decayTween.kill();
          tween.kill();
          if (handleMouseEnter && handleMouseLeave) {
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
          }
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { xPercent: 0 });
      });
    },
    { scope: containerRef, dependencies: [speed, reverse, pauseOnHover] }
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full whitespace-nowrap select-none ${className}`}
    >
      <div
        ref={trackRef}
        className="flex w-fit will-change-transform transform-gpu"
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
