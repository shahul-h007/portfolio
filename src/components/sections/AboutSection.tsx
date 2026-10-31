"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import { aboutNarrative, plainFacts } from "@/content/about";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const words = aboutNarrative.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Word-level scrub from dim to bright on scroll
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const wordSpans = paragraphRef.current?.querySelectorAll(".about-word");
        if (!wordSpans || wordSpans.length === 0) return;

        gsap.fromTo(
          wordSpans,
          {
            opacity: 0.15,
            color: "#8E929E",
          },
          {
            opacity: 1,
            color: "#F5F5F7",
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: paragraphRef.current,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.5,
            },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const wordSpans = paragraphRef.current?.querySelectorAll(".about-word");
        if (wordSpans) {
          gsap.set(wordSpans, { opacity: 1, color: "#F5F5F7" });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 w-full bg-canvas text-ink border-t border-white/10 py-24 md:py-36"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10 mb-16 md:mb-20">
          <div>
            <div className="font-mono text-label-mono text-gold tracking-widest uppercase mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gold" />
              <span>04 / Identity</span>
            </div>
            <h2 className="font-display text-display-md md:text-display-lg uppercase tracking-tight text-ink font-semibold">
              <SplitReveal>About Me</SplitReveal>
            </h2>
          </div>
          <span className="font-mono text-xs text-muted uppercase tracking-wider">
            Engineer · Builder · Problem Solver
          </span>
        </div>

        {/* Main Content Layout: Large Scrobble Text on Left, 3 Ruled Facts on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Word-by-word Scrub Paragraph */}
          <div className="lg:col-span-7">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-4">
              Mission & Engineering Philosophy
            </span>
            <p
              ref={paragraphRef}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-medium leading-[1.35] tracking-tight"
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className="about-word inline-block opacity-15 will-change-transform mr-[0.28em]"
                >
                  {word}
                </span>
              ))}
            </p>
          </div>

          {/* Right Column: 3 Plain Ruled Facts (No repeated portrait) */}
          <div className="lg:col-span-5">
            <span className="font-mono text-xs text-muted/60 uppercase tracking-widest block mb-4">
              Core Profile & Fundamentals
            </span>

            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {plainFacts.map((fact, idx) => (
                <Reveal key={fact.index} delay={idx * 0.08}>
                  <div className="py-6 group">
                    <div className="flex items-center justify-between mb-2 font-mono text-[11px] text-muted tracking-wider">
                      <span className="text-gold">{fact.index} // {fact.label}</span>
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-ink mb-2 group-hover:text-gold transition-colors duration-200">
                      {fact.title}
                    </h3>
                    <p className="font-sans text-sm text-muted leading-relaxed">
                      {fact.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
