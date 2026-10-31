"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "@/components/motion/SplitReveal";
import { skillsCatalog } from "@/content/skills";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = rowsContainerRef.current?.querySelectorAll(".skill-index-row");
        if (!rows || rows.length === 0) return;

        gsap.fromTo(
          rows,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rowsContainerRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const rows = rowsContainerRef.current?.querySelectorAll(".skill-index-row");
        if (rows) {
          gsap.set(rows, { y: 0, opacity: 1 });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-10 w-full bg-canvas text-ink border-t border-white/10 py-24 md:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10 mb-12 md:mb-16">
          <div>
            <div className="font-mono text-label-mono text-gold tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gold" />
              <span>02 / Capabilities</span>
            </div>
            <h2 className="font-display text-display-md md:text-display-lg uppercase tracking-tight text-ink font-semibold">
              <SplitReveal>Technical Arsenal</SplitReveal>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-muted">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border border-white/20 text-ink/80 text-[10px] tracking-wider uppercase">
                Shipped
              </span>
              <span>Used in production & shipped products</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border border-gold/40 text-gold text-[10px] tracking-wider uppercase">
                Learning
              </span>
              <span>Actively expanding competencies</span>
            </div>
          </div>
        </div>

        {/* Typographic Index Rows */}
        <div
          ref={rowsContainerRef}
          onMouseLeave={() => setHoveredIdx(null)}
          className="divide-y divide-white/10 border-t border-b border-white/10"
        >
          {skillsCatalog.map((category, idx) => {
            const isHovered = hoveredIdx === idx;
            const isOtherHovered = hoveredIdx !== null && !isHovered;

            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`skill-index-row group py-8 md:py-12 transition-all duration-300 ${
                  isHovered
                    ? "opacity-100 bg-surface/30 px-3 md:px-6 -mx-3 md:-mx-6"
                    : isOtherHovered
                    ? "opacity-30"
                    : "opacity-100"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline">
                  {/* Left Column: Category Name and Index */}
                  <div className="lg:col-span-3 flex items-baseline gap-4">
                    <span className="font-mono text-xs text-gold tracking-widest font-semibold">
                      {category.index}
                    </span>
                    <h3 className="font-mono text-sm md:text-base uppercase tracking-widest text-muted group-hover:text-gold transition-colors duration-200 font-medium">
                      {category.title}
                    </h3>
                  </div>

                  {/* Right Column: Display-Type Technologies with Mono Tags */}
                  <div className="lg:col-span-9 flex flex-wrap items-baseline gap-y-3 leading-relaxed">
                    {category.skills.map((skill, sIdx) => (
                      <React.Fragment key={skill.name}>
                        <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
                          <span className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-ink font-bold tracking-tight group-hover:text-white transition-colors duration-200">
                            {skill.name}
                          </span>
                          <span
                            className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border align-middle ${
                              skill.tag === "Shipped"
                                ? "border-white/20 text-white/80 bg-white/5"
                                : "border-gold/40 text-gold bg-gold/10 font-medium"
                            }`}
                          >
                            {skill.tag}
                          </span>
                        </span>

                        {sIdx < category.skills.length - 1 && (
                          <span className="text-white/20 mx-3 font-light text-base md:text-xl select-none">
                            /
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
