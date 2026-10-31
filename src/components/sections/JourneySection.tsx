"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "@/components/motion/SplitReveal";
import { journeyData } from "@/content/journey";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: Pinned Horizontal Scroll
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        // Calculate scroll distance
        const getScrollDistance = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      });

      // Mobile / Reduced Motion: Reset track translation
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        if (trackRef.current) {
          gsap.set(trackRef.current, { x: 0 });
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative z-10 w-full bg-chassis text-ink border-t border-white/10"
    >
      {/* Top Progress Bar for Pinned Desktop Section */}
      <div className="hidden md:block absolute top-0 inset-x-0 z-30 h-[2px] bg-white/10">
        <div
          ref={progressBarRef}
          className="h-full bg-gold origin-left will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Static Section Header: Displayed at the top on both mobile & desktop */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="font-mono text-label-mono text-gold tracking-widest uppercase mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gold" />
              <span>03 / Trajectory</span>
            </div>
            <h2 className="font-display text-display-md md:text-display-lg uppercase tracking-tight text-ink font-semibold">
              <SplitReveal>Engineering Journey</SplitReveal>
            </h2>
          </div>
          <p className="font-mono text-xs text-muted max-w-sm">
            From foundational computer science to shipping production software and mastering systems infrastructure.
          </p>
        </div>
      </div>

      {/* Track: Horizontal on desktop (≥768px), Vertical Stack on mobile (<768px) */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row md:flex-nowrap w-full md:w-[300vw] will-change-transform"
        >
          {journeyData.map((panel, idx) => (
            <div
              key={panel.index}
              className="w-full md:w-[100vw] min-h-[500px] md:min-h-[70vh] flex flex-col justify-center px-4 md:px-12 lg:px-20 py-12 md:py-16 border-b md:border-b-0 md:border-r border-white/10 bg-chassis"
            >
              <div className="max-w-4xl mx-auto md:mx-0 w-full">
                {/* Panel Phase Label */}
                <div className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-muted mb-4">
                  <span className="text-gold font-bold">{panel.phase}</span>
                  <span className="text-white/20">/</span>
                  <span>{panel.subtitle}</span>
                </div>

                {/* Huge Number & Heading */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline mb-8">
                  <div className="md:col-span-3">
                    <span aria-hidden="true" className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white/25 leading-none select-none">
                      {panel.index}
                    </span>
                  </div>

                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight font-bold text-ink mb-4">
                      {panel.title}
                    </h3>
                    
                    {/* Paragraph in Shahul's authentic voice */}
                    <p className="font-sans text-muted text-base md:text-lg lg:text-xl leading-relaxed">
                      {panel.body}
                    </p>
                  </div>
                </div>

                {/* Plain text milestone tags joined by ' · ' per AGENTS.md */}
                <div className="pt-6 border-t border-white/10">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
                    Key Milestones & Focus
                  </div>
                  <p className="font-mono text-xs md:text-sm text-ink/80 leading-relaxed">
                    {panel.tags.join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
