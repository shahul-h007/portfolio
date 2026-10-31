"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0 to 1, default 0.35
}

export default function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const target = targetRef.current;
      if (!container || !target) return;

      const mm = gsap.matchMedia();

      // Only enable on desktop pointer with fine control and no reduced motion preference
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            gsap.to(target, {
              x: deltaX,
              y: deltaY,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(target, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1, 0.3)",
              overwrite: "auto",
            });
          };

          container.addEventListener("mousemove", handleMouseMove);
          container.addEventListener("mouseleave", handleMouseLeave);

          return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      );
    },
    { scope: containerRef, dependencies: [strength] }
  );

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      <div ref={targetRef} className="will-change-transform transform-gpu">
        {children}
      </div>
    </div>
  );
}
