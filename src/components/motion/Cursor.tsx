"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only on devices with hover and fine pointer, and no reduced motion
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const dot = dotRef.current;
          const ring = ringRef.current;
          if (!dot || !ring) return;

          // Quick setters for smooth performant following
          const setDotX = gsap.quickTo(dot, "x", {
            duration: 0.08,
            ease: "power2.out",
          });
          const setDotY = gsap.quickTo(dot, "y", {
            duration: 0.08,
            ease: "power2.out",
          });
          const setRingX = gsap.quickTo(ring, "x", {
            duration: 0.22,
            ease: "power2.out",
          });
          const setRingY = gsap.quickTo(ring, "y", {
            duration: 0.22,
            ease: "power2.out",
          });

          const onMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            setDotX(e.clientX);
            setDotY(e.clientY);
            setRingX(e.clientX);
            setRingY(e.clientY);
          };

          const onMouseEnterWindow = () => setIsVisible(true);
          const onMouseLeaveWindow = () => setIsVisible(false);

          const onPointerOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
            const interactiveTarget = target.closest<HTMLElement>(
              "a, button, [role='button'], input, textarea, select"
            );

            if (cursorTarget) {
              const label = cursorTarget.getAttribute("data-cursor") || "";
              setCursorText(label);
              setIsHovered(true);
            } else if (interactiveTarget) {
              setCursorText("");
              setIsHovered(true);
            } else {
              setCursorText("");
              setIsHovered(false);
            }
          };

          window.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseenter", onMouseEnterWindow);
          document.addEventListener("mouseleave", onMouseLeaveWindow);
          document.addEventListener("mouseover", onPointerOver);

          return () => {
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnterWindow);
            document.removeEventListener("mouseleave", onMouseLeaveWindow);
            document.removeEventListener("mouseover", onPointerOver);
          };
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 will-change-transform ${
          isHovered ? "h-1 w-1 bg-gold opacity-50" : "h-1.5 w-1.5 bg-ink"
        }`}
      />

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 will-change-transform ${
          cursorText
            ? "h-16 w-16 bg-gold/10 border border-gold/70 backdrop-blur-[2px]"
            : isHovered
            ? "h-12 w-12 border border-gold/50 bg-gold/5 scale-110"
            : "h-8 w-8 border border-white/20 bg-transparent"
        }`}
      >
        {cursorText && (
          <span
            ref={labelRef}
            className="font-mono text-[10px] font-medium tracking-wider text-gold uppercase px-1 text-center select-none"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
