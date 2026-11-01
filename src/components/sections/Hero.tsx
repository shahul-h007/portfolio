"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useIntro } from "@/context/IntroContext";
import { useLenis } from "@/components/motion/SmoothScroll";
import Magnetic from "@/components/motion/Magnetic";
import SplitReveal from "@/components/motion/SplitReveal";
import Marquee from "@/components/motion/Marquee";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { introFinished } = useIntro();
  const lenis = useLenis();

  const heroSectionRef = useRef<HTMLElement>(null);
  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const contentFadeRef = useRef<HTMLDivElement>(null);

  const word1Chars = ["S", "H", "A", "H", "U", "L"];
  const word2Chars = ["H", "A", "M", "E", "E", "D"];

  const realTechnologies = [
    "Next.js",
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Supabase",
    "PostgreSQL",
    "Prisma",
    "Flutter",
    "Linux",
    "Docker",
    "Node.js",
    "Git",
    "REST APIs",
  ];

  useGSAP(
    () => {
      const hero = heroSectionRef.current;
      if (!hero) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // If intro has not yet completed, hold initial hidden states
        if (!introFinished) {
          if (portraitWrapRef.current) {
            gsap.set(portraitWrapRef.current, {
              clipPath: "inset(100% 0% 0% 0%)",
            });
          }
          const chars = hero.querySelectorAll(".hero-char-inner");
          if (chars.length > 0) {
            gsap.set(chars, { yPercent: 110 });
          }
          if (contentFadeRef.current) {
            gsap.set(contentFadeRef.current, { opacity: 0, y: 16 });
          }
          return;
        }

        const tl = gsap.timeline();

        // 1. Characters rise out of overflow-hidden masks with stagger
        const chars = hero.querySelectorAll(".hero-char-inner");
        if (chars && chars.length > 0) {
          tl.fromTo(
            chars,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.035,
              ease: "power4.out",
            }
          );
        }

        // 2. Portrait reveals via bottom inset clip-path
        if (portraitWrapRef.current) {
          tl.fromTo(
            portraitWrapRef.current,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.0,
              ease: "expo.out",
            },
            "-=0.6"
          );
        }

        // 3. Subline, CTAs and Meta row rise and fade in
        if (contentFadeRef.current) {
          tl.fromTo(
            contentFadeRef.current,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.5"
          );
        }

        // 4. Scroll out of hero: words drift apart horizontally & fade (scrub)
        if (word1Ref.current && word2Ref.current) {
          gsap.to(word1Ref.current, {
            xPercent: -20,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.2,
            },
          });

          gsap.to(word2Ref.current, {
            xPercent: 20,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.2,
            },
          });
        }

        // 5. Portrait slow parallax on scroll (translates ~8% slower, scales 1.12 to 1.0)
        if (portraitImgRef.current) {
          gsap.fromTo(
            portraitImgRef.current,
            { yPercent: 0, scale: 1.12 },
            {
              yPercent: 8,
              scale: 1.0,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Immediate display for reduced motion
        const chars = hero.querySelectorAll(".hero-char-inner");
        if (chars) {
          gsap.set(chars, { yPercent: 0 });
        }
        if (portraitWrapRef.current) {
          gsap.set(portraitWrapRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
          });
        }
        if (contentFadeRef.current) {
          gsap.set(contentFadeRef.current, { opacity: 1, y: 0 });
        }
      });
    },
    { scope: heroSectionRef, dependencies: [introFinished] }
  );

  return (
    <>
      <section
        ref={heroSectionRef}
        id="hero"
        className="relative min-h-[100dvh] w-full max-w-[100vw] flex flex-col justify-between pt-20 pb-8 md:pt-24 md:pb-10 px-4 sm:px-6 md:px-12 bg-canvas overflow-x-hidden"
      >
        {/* Main Composition: Giant Wordmark with Overlapping Depth Portrait */}
        <div className="w-full max-w-[1440px] mx-auto relative flex-1 flex flex-col justify-center my-auto overflow-hidden sm:overflow-visible">
          {/* Portrait Container - Positioned at z-10 behind/interleaved with wordmark at z-20 so all text stays 100% readable */}
          <div
            ref={portraitWrapRef}
            className="absolute right-0 sm:right-6 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 w-28 h-40 sm:w-44 sm:h-60 md:w-56 md:h-76 lg:w-72 lg:h-96 z-10 pointer-events-none will-change-transform overflow-hidden shadow-2xl opacity-85 sm:opacity-100"
          >
            <Image
              ref={portraitImgRef}
              src="/images/shahul-portrait.png"
              alt="Shahul Hameed"
              fill
              priority
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 224px, 288px"
              className="object-cover object-top filter grayscale contrast-125 brightness-90 will-change-transform"
            />
          </div>

          {/* Giant Wordmark: 2 lines in Syne display type at z-20 for total readability */}
          <div className="w-full select-none leading-none z-20 relative flex flex-col space-y-1 sm:space-y-2">
            {/* Word 1: SHAHUL */}
            <div
              ref={word1Ref}
              className="font-display font-extrabold tracking-tighter text-ink text-[clamp(2.15rem,7.2vw,7.5rem)] flex will-change-transform"
            >
              {word1Chars.map((char, index) => (
                <span
                  key={index}
                  className="overflow-hidden inline-block leading-none py-1"
                >
                  <span className="hero-char-inner inline-block transform-gpu will-change-transform">
                    {char}
                  </span>
                </span>
              ))}
            </div>

            {/* Word 2: HAMEED. with Gold Full Stop (Strictly Gold Accent 1) */}
            <div
              ref={word2Ref}
              className="font-display font-extrabold tracking-tighter text-ink text-[clamp(2.15rem,7.2vw,7.5rem)] flex will-change-transform pl-[3vw] sm:pl-[6vw] md:pl-[8vw]"
            >
              {word2Chars.map((char, index) => (
                <span
                  key={index}
                  className="overflow-hidden inline-block leading-none py-1"
                >
                  <span className="hero-char-inner inline-block transform-gpu will-change-transform">
                    {char}
                  </span>
                </span>
              ))}
              {/* Full stop in gold — accent #1 in viewport */}
              <span className="overflow-hidden inline-block leading-none py-1">
                <span className="hero-char-inner inline-block text-gold transform-gpu will-change-transform">
                  .
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Lower Composition: Subline, 2-Sentence Intro, CTAs, Ruled Meta Row */}
        <div
          ref={contentFadeRef}
          className="w-full max-w-[1440px] mx-auto z-20 flex flex-col space-y-5 pt-4 will-change-transform"
        >
          {/* Text Row: Headline + 2-Sentence Intro */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-end">
            <div className="md:col-span-7">
              <span className="font-mono text-[10px] sm:text-xs text-muted tracking-widest uppercase block mb-1">
                Developer & Systems Builder
              </span>
              <SplitReveal
                as="h1"
                className="font-sans text-base sm:text-lg md:text-xl font-medium tracking-tight text-ink leading-snug"
              >
                Building digital products through code.
              </SplitReveal>
            </div>

            <div className="md:col-span-5">
              <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                Full-stack developer focused on modern web applications, clean
                architecture, and purposeful motion. Engineering reliable software
                systems with speed, security, and tactile precision.
              </p>
            </div>
          </div>

          {/* Action Row: Two CTAs */}
          <div className="flex flex-wrap items-center gap-6 pt-1">
            {/* CTA 1: Solid button wrapped in Magnetic. Hover to gold is Accent #2 */}
            <Magnetic strength={0.25}>
              <Link
                href="/#work"
                data-cursor="Work"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", "/#work");
                  if (lenis) lenis.scrollTo("#work", { duration: 1.2 });
                  else document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-ink text-canvas font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-200 hover:bg-gold hover:text-canvas focus-visible:outline-gold"
              >
                Explore my work
              </Link>
            </Magnetic>

            {/* CTA 2: Underlined text link */}
            <Link
              href="/#contact"
              data-cursor="Connect"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", "/#contact");
                if (lenis) lenis.scrollTo("#contact", { duration: 1.2 });
                else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink underline underline-offset-8 decoration-white/20 hover:decoration-white/60 transition-colors"
            >
              Contact me
            </Link>
          </div>

          {/* Ruled Meta Row at the Bottom */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px] sm:text-xs text-muted pb-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Based in Kochi, Kerala</span>
              <span className="text-white/20">·</span>
              <span>BCA, University of Calicut</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                aria-hidden="true"
              />
              <span>Open to freelance and full-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip directly under Hero */}
      <section
        className="w-full border-y border-white/10 bg-chassis py-4 overflow-hidden"
        aria-label="Core technical competencies"
      >
        <Marquee speed={30} pauseOnHover={true}>
          {realTechnologies.map((tech, idx) => (
            <span
              key={idx}
              className="inline-flex items-center mx-6 font-display text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider text-white/20 hover:text-white/40 transition-colors"
            >
              <span>{tech}</span>
              <span className="mx-6 text-white/10 font-mono text-xs font-normal">
                /
              </span>
            </span>
          ))}
        </Marquee>
      </section>
    </>
  );
}
