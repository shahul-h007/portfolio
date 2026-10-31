"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { ventures } from "@/content/ventures";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";

export default function VenturesSection() {
  return (
    <section
      id="ventures"
      className="relative z-10 w-full bg-canvas text-ink border-t border-white/10 py-16 md:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Intentionally quiet section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10 mb-8 md:mb-12">
          <div>
            <div className="font-mono text-label-mono text-gold tracking-widest uppercase mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gold" />
              <span>05 / Experiments</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-ink font-bold">
              <SplitReveal>Ventures & Experiments</SplitReveal>
            </h2>
          </div>
          <p className="font-mono text-xs text-muted max-w-sm">
            Independent physical explorations and creative concept labs outside primary software engineering.
          </p>
        </div>

        {/* Short Ruled List */}
        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {ventures.map((venture, idx) => (
            <Reveal key={venture.id} delay={idx * 0.06}>
              <div className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-baseline group hover:bg-surface/20 transition-colors duration-200">
                {/* Index & Name */}
                <div className="md:col-span-4 flex items-baseline gap-4">
                  <span className="font-mono text-xs text-muted/60 tracking-widest">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-ink group-hover:text-gold transition-colors duration-200">
                      {venture.name}
                    </h3>
                    <span className="font-mono text-[11px] text-muted/70 tracking-wider uppercase">
                      {venture.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-5">
                  <p className="font-sans text-sm text-muted leading-relaxed">
                    {venture.description}
                  </p>
                </div>

                {/* Status & Domain Link */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-6">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        venture.status === "In development"
                          ? "bg-amber-400"
                          : "bg-white/40"
                      }`}
                    />
                    <span className="font-mono text-xs text-muted tracking-wider uppercase">
                      {venture.status}
                    </span>
                  </div>

                  {venture.domain && (
                    <a
                      href={`https://${venture.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-gold transition-colors duration-200"
                    >
                      <span>{venture.domain}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
