"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, ExternalLink, Github, Lock, Eye } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, Project } from "@/content/projects";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import { TransitionLink, usePageTransition } from "@/components/motion/PageTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { navigateWithTransition } = usePageTransition();

  const featuredProjects = projects.filter((p) => p.featured);
  const secondaryProjects = projects.filter((p) => !p.featured);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Only enable sticky scale/dim on desktop (min-width: 768px)
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        panelsRef.current.forEach((panel, i) => {
          if (!panel) return;
          const nextPanel = panelsRef.current[i + 1];

          // If there is a next panel, scale down and dim this panel as the next slides over
          if (nextPanel) {
            gsap.to(panel, {
              scale: 0.94,
              opacity: 0.35,
              ease: "none",
              transformOrigin: "center top",
              scrollTrigger: {
                trigger: nextPanel,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            });
          }

          // Gentle parallax for the screenshot / media container inside each card
          const mediaInner = panel.querySelector<HTMLElement>(".project-media-inner");
          if (mediaInner) {
            gsap.fromTo(
              mediaInner,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative z-10 w-full bg-canvas text-ink border-t border-white/10"
    >
      {/* Section Header */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="font-mono text-label-mono text-gold tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gold" />
              <span>01 / Portfolio</span>
            </div>
            <h2 className="font-display text-display-md md:text-display-lg uppercase tracking-tight text-ink font-semibold">
              <SplitReveal>Selected Work</SplitReveal>
            </h2>
          </div>
          <p className="font-sans text-body text-muted max-w-md text-sm md:text-base leading-relaxed">
            Real software systems engineered for commercial operations, tenant utilities, and digital platforms.
          </p>
        </div>
      </div>

      {/* Featured Projects: Sticky Stacking on Desktop */}
      <div className="relative w-full">
        {featuredProjects.map((project, index) => {
          const indexFormatted = String(index + 1).padStart(2, "0");

          return (
            <div
              key={project.id}
              ref={(el) => {
                panelsRef.current[index] = el;
              }}
              data-cursor="View"
              onClick={(e) => {
                // If user didn't click directly on an interactive external link
                const target = e.target as HTMLElement;
                if (!target.closest("a")) {
                  navigateWithTransition(`/work/${project.id}`);
                }
              }}
              className="sticky top-0 z-[10] min-h-[92vh] md:h-screen w-full bg-chassis border-b border-white/10 flex flex-col justify-center py-12 md:py-0 cursor-pointer select-none transition-colors duration-300 hover:border-gold/30"
            >
              <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column: Project Meta & Content */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      {/* Index & Category Row */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <span className="font-mono text-label-mono text-muted tracking-widest">
                          {indexFormatted} / {String(featuredProjects.length).padStart(2, "0")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              project.status === "Deployed"
                                ? "bg-emerald-400"
                                : project.status === "In development"
                                ? "bg-amber-400"
                                : "bg-cyan-400"
                            }`}
                          />
                          <span className="font-mono text-xs text-muted tracking-wider uppercase">
                            {project.statusBadge}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-[clamp(1.75rem,5.5vw,3.25rem)] uppercase tracking-tight font-bold text-ink mb-3 break-words leading-tight">
                        <SplitReveal>{project.title}</SplitReveal>
                      </h3>

                      {/* Category Label */}
                      <p className="font-mono text-xs text-gold uppercase tracking-wider mb-5">
                        {project.category}
                      </p>

                      {/* Problem Statement */}
                      <p className="font-sans text-muted text-sm md:text-base leading-relaxed mb-6">
                        {project.problemStatement}
                      </p>

                      {/* Tech Stack: Plain text separated by ' · ' per AGENTS.md */}
                      <div className="pt-4 border-t border-white/10 mb-8">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
                          Core Architecture
                        </div>
                        <p className="font-mono text-xs md:text-sm text-ink/90 leading-relaxed">
                          {project.stack.join(" · ")}
                        </p>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                      <TransitionLink
                        href={`/work/${project.id}`}
                        className="group inline-flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-wider text-ink hover:text-gold transition-colors duration-200"
                      >
                        <span>Case Study</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </TransitionLink>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="group inline-flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-wider text-muted hover:text-ink transition-colors duration-200"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="group inline-flex items-center gap-2 font-mono text-xs md:text-sm uppercase tracking-wider text-muted hover:text-ink transition-colors duration-200"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}

                      {!project.liveUrl && !project.githubUrl && (
                        <span className="font-mono text-xs text-muted/60 italic">
                          Client project · Private repository
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Screenshot or Typographic Placeholder Frame */}
                  <div className="lg:col-span-7">
                    <div className="relative w-full aspect-[16/10] bg-surface border border-white/10 overflow-hidden group/frame">
                      {/* Top Frame Rule Header */}
                      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-chassis/90 border-b border-white/10 font-mono text-[10px] text-muted tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-white/20" />
                          <span>{project.id.toUpperCase()} // SYS.VIEW</span>
                        </div>
                        <span className="text-white/40">1440 × 900</span>
                      </div>

                      {/* Visual Content */}
                      <div className="project-media-inner relative w-full h-full pt-8 flex items-center justify-center overflow-hidden">
                        {project.desktopImage && !project.previewComing ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={project.desktopImage}
                              alt={`${project.title} live interface capture`}
                              fill
                              unoptimized
                              className="object-cover object-top transition-transform duration-700 group-hover/frame:scale-105"
                            />
                            {/* Subtle dark vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-chassis/60 via-transparent to-transparent pointer-events-none" />
                          </div>
                        ) : (
                          /* Typographic Placeholder */
                          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-chassis/70">
                            <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-4 text-gold">
                              {project.id === "shefeer-portfolio" ? (
                                <Eye className="w-5 h-5 text-gold/80" />
                              ) : (
                                <Lock className="w-5 h-5 text-gold/80" />
                              )}
                            </div>
                            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-ink font-semibold mb-2">
                              Preview Coming
                            </div>
                            <p className="font-sans text-xs md:text-sm text-muted max-w-sm leading-relaxed mb-4">
                              {project.previewReason || "Preview is currently being assembled."}
                            </p>
                            <span className="font-mono text-[11px] text-muted/60 border border-white/10 px-2.5 py-1 uppercase tracking-wider">
                              {project.statusBadge}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Projects: Ruled Expandable Row List */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 md:py-28 border-t border-white/10">
        <div className="mb-10">
          <div className="font-mono text-label-mono text-gold tracking-widest uppercase mb-2">
            Archival & System Builds
          </div>
          <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-ink font-bold">
            Secondary & Capstone Projects
          </h3>
        </div>

        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {secondaryProjects.map((project, i) => {
            const indexNumber = String(featuredProjects.length + i + 1).padStart(2, "0");

            return (
              <TransitionLink
                key={project.id}
                href={`/work/${project.id}`}
                data-cursor="View"
                className="group block py-6 md:py-8 transition-colors duration-200 hover:bg-surface/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start md:items-center">
                  {/* Index & Title */}
                  <div className="md:col-span-4 flex items-center gap-4">
                    <span className="font-mono text-xs md:text-sm text-muted tracking-widest">
                      {indexNumber}
                    </span>
                    <h4 className="font-display text-xl md:text-2xl uppercase tracking-tight font-bold text-ink group-hover:text-gold transition-colors duration-200">
                      {project.title}
                    </h4>
                  </div>

                  {/* Summary */}
                  <div className="md:col-span-5">
                    <p className="font-sans text-sm text-muted leading-relaxed line-clamp-2 md:line-clamp-1">
                      {project.problemStatement}
                    </p>
                  </div>

                  {/* Status & Attribution */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <span className="inline-block font-mono text-[11px] text-muted tracking-wider uppercase">
                        {project.statusBadge}
                      </span>
                    </div>
                    <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-muted group-hover:text-gold group-hover:border-gold/40 transition-all duration-200">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details on Hover (Plain text stack per AGENTS.md) */}
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-12 gap-2 text-xs font-mono text-muted/80 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="md:col-span-4 text-gold/80 uppercase tracking-wider">
                    {project.category}
                  </div>
                  <div className="md:col-span-8 text-ink/70">
                    <span className="text-muted mr-2">Stack:</span>
                    {project.stack.join(" · ")}
                  </div>
                </div>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
