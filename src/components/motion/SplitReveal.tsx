"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface SplitRevealProps {
  children?: string;
  text?: string;
  className?: string;
  splitBy?: "lines" | "chars";
  delay?: number;
  duration?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
}

export default function SplitReveal({
  children,
  text,
  className = "",
  splitBy = "lines",
  delay = 0,
  duration = 1.0,
  stagger = 0.06,
  as: Component = "div",
}: SplitRevealProps) {
  const content = text ?? children ?? "";
  const containerRef = useRef<HTMLElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const hasAnimatedRef = useRef(false);

  const words = content.split(" ").filter(Boolean);

  // Function to split text into lines by measuring word offsets
  const splitTextIntoLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove existing masks if re-splitting
    const existingMasks = container.querySelectorAll(".split-line-mask");
    if (existingMasks.length > 0) {
      // Restore raw words
      container.innerHTML = "";
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "inline-block split-word";
        span.textContent = word + (index < words.length - 1 ? "\u00A0" : "");
        container.appendChild(span);
      });
    }

    const wordSpans = Array.from(
      container.querySelectorAll<HTMLSpanElement>(".split-word")
    );
    if (wordSpans.length === 0) return;

    // Group words into lines based on vertical offset
    const lines: HTMLSpanElement[][] = [];
    let currentLine: HTMLSpanElement[] = [];
    let lastTop = -1;

    wordSpans.forEach((wordSpan) => {
      const top = Math.round(wordSpan.offsetTop);
      if (lastTop === -1 || Math.abs(top - lastTop) <= 4) {
        currentLine.push(wordSpan);
        lastTop = top;
      } else {
        lines.push(currentLine);
        currentLine = [wordSpan];
        lastTop = top;
      }
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // Wrap each line in an overflow-hidden mask
    container.innerHTML = "";
    lines.forEach((lineWords) => {
      const mask = document.createElement("span");
      mask.className = "split-line-mask block overflow-hidden leading-none";

      const inner = document.createElement("span");
      inner.className =
        "split-line-inner block will-change-transform transform-gpu";

      if (splitBy === "chars") {
        lineWords.forEach((wordSpan, wIdx) => {
          const wordText = wordSpan.textContent || "";
          const wordWrap = document.createElement("span");
          wordWrap.className = "inline-block whitespace-nowrap";

          Array.from(wordText).forEach((char) => {
            const charMask = document.createElement("span");
            charMask.className =
              "split-char-mask inline-block overflow-hidden";
            const charInner = document.createElement("span");
            charInner.className =
              "split-char-inner inline-block will-change-transform";
            charInner.textContent = char === " " ? "\u00A0" : char;
            charMask.appendChild(charInner);
            wordWrap.appendChild(charMask);
          });

          inner.appendChild(wordWrap);
        });
      } else {
        lineWords.forEach((wordSpan) => {
          inner.appendChild(wordSpan);
        });
      }

      mask.appendChild(inner);
      container.appendChild(mask);
    });

    return lines;
  }, [words, splitBy]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        splitTextIntoLines();

        const targets =
          splitBy === "chars"
            ? containerRef.current?.querySelectorAll(".split-char-inner")
            : containerRef.current?.querySelectorAll(".split-line-inner");

        if (!targets || targets.length === 0) return;

        if (hasAnimatedRef.current) {
          gsap.set(targets, { yPercent: 0, opacity: 1 });
          return;
        }

        gsap.fromTo(
          targets,
          {
            yPercent: 110,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true,
              onEnter: () => {
                hasAnimatedRef.current = true;
              },
            },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        splitTextIntoLines();
        const targets =
          containerRef.current?.querySelectorAll(
            ".split-line-inner, .split-char-inner"
          );
        if (targets) {
          gsap.set(targets, { yPercent: 0, opacity: 1 });
        }
      });
    },
    { scope: containerRef, dependencies: [splitTextIntoLines, splitBy] }
  );

  // Re-split on window resize (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        splitTextIntoLines();
        if (hasAnimatedRef.current) {
          const targets =
            containerRef.current?.querySelectorAll(
              ".split-line-inner, .split-char-inner"
            );
          if (targets) {
            gsap.set(targets, { yPercent: 0, opacity: 1 });
          }
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [splitTextIntoLines]);

  return (
    // @ts-expect-error dynamic component type
    <Component ref={containerRef} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block split-word">
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Component>
  );
}
