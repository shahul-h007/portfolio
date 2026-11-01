import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock, Eye, CheckCircle2 } from "lucide-react";
import { projects, Project } from "@/content/projects";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import { SITE_URL } from "@/config/site";

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Case Study`,
    description: project.problemStatement,
    alternates: {
      canonical: `${SITE_URL}/work/${slug}/`,
    },
    openGraph: {
      title: `${project.title} — Case Study | Shahul Hameed`,
      description: project.problemStatement,
      url: `${SITE_URL}/work/${slug}/`,
      type: "article",
      images: [
        {
          url: project.desktopImage || "/og.png",
          width: 1200,
          height: 630,
          alt: `${project.title} — Case Study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study | Shahul Hameed`,
      description: project.problemStatement,
      images: [project.desktopImage || "/og.png"],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.id === slug);
  if (projectIndex === -1) {
    notFound();
  }

  const project: Project = projects[projectIndex];
  const prevProjectIndex = (projectIndex - 1 + projects.length) % projects.length;
  const prevProject: Project = projects[prevProjectIndex];
  const nextProjectIndex = (projectIndex + 1) % projects.length;
  const nextProject: Project = projects[nextProjectIndex];
  const indexFormatted = String(projectIndex + 1).padStart(2, "0");

  return (
    <article className="w-full bg-canvas text-ink pt-20 pb-0">
      {/* Sticky Sub-Header with "← All work" & Breadcrumb */}
      <div className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-md border-b border-white/10 mb-8 md:mb-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-12 md:h-14 flex items-center justify-between text-xs font-mono">
          {/* Always reachable "← All work" */}
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 uppercase tracking-wider text-ink hover:text-gold transition-colors focus-visible:outline-gold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gold" />
            <span>All work</span>
          </Link>

          {/* Breadcrumb: Home / Work / <project> */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-muted">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/#work" className="hover:text-ink transition-colors">
              Work
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-ink font-medium truncate max-w-[140px] sm:max-w-none">
              {project.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <header className="max-w-[1440px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
        {/* Project Meta Pill/Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 font-mono text-xs tracking-wider uppercase text-muted">
          <div className="flex items-center gap-3">
            <span className="text-gold font-bold">{indexFormatted} // CASE STUDY</span>
            <span className="text-white/20">|</span>
            <span>{project.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                project.status === "Deployed"
                  ? "bg-emerald-400"
                  : project.status === "In development"
                  ? "bg-amber-400"
                  : "bg-cyan-400"
              }`}
            />
            <span className="text-ink font-medium">{project.statusBadge}</span>
          </div>
        </div>

        {/* Huge Title */}
        <h1 className="font-display text-[clamp(1.45rem,6.2vw,5.5rem)] uppercase tracking-tight font-extrabold text-ink mb-6 break-words leading-[1.05]">
          <SplitReveal>{project.title}</SplitReveal>
        </h1>

        {/* Tagline */}
        <p className="font-sans text-lg md:text-2xl text-muted max-w-3xl leading-relaxed mb-10">
          {project.tagline}
        </p>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-6 pb-12 border-b border-white/10">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-canvas font-mono text-xs md:text-sm uppercase tracking-wider font-semibold hover:bg-gold hover:text-canvas transition-colors duration-200"
            >
              <span>Live Demonstration</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 font-mono text-xs md:text-sm uppercase tracking-wider text-ink hover:border-gold hover:text-gold transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}

          {!project.liveUrl && !project.githubUrl && (
            <span className="font-mono text-xs md:text-sm text-muted/70 italic border border-white/10 px-4 py-2">
              {project.statusBadge} · Source maintained privately
            </span>
          )}
        </div>

        {/* Hero Screenshot / Frame */}
        <div className="mt-12 w-full aspect-[16/9] md:aspect-[21/9] bg-surface border border-white/10 overflow-hidden relative">
          {/* Header Bar */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2.5 bg-chassis/90 border-b border-white/10 font-mono text-[11px] text-muted tracking-wider">
            <span>{project.id.toUpperCase()} // SYSTEM CAPTURE</span>
            <span className="text-white/40">RESOLUTION: NATIVE</span>
          </div>

          <div className="w-full h-full pt-10 flex items-center justify-center">
            {project.desktopImage && !project.previewComing ? (
              <div className="relative w-full h-full">
                <Image
                  src={project.desktopImage}
                  alt={`${project.title} detailed dashboard interface`}
                  fill
                  priority
                  unoptimized
                  className="object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-chassis/80">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-4 text-gold">
                  {project.id === "shefeer-portfolio" ? (
                    <Eye className="w-7 h-7 text-gold/80" />
                  ) : (
                    <Lock className="w-7 h-7 text-gold/80" />
                  )}
                </div>
                <h2 className="font-mono text-base md:text-lg uppercase tracking-widest text-ink font-bold mb-2">
                  Preview Coming
                </h2>
                <p className="font-sans text-sm text-muted max-w-md leading-relaxed mb-4">
                  {project.previewReason || "Preview is currently being assembled."}
                </p>
                <div className="font-mono text-xs text-muted/70 border border-white/10 px-3 py-1 uppercase">
                  {project.statusBadge}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. THE PROBLEM */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
              01 // Context
            </span>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight font-bold text-ink">
              <SplitReveal>The Problem</SplitReveal>
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <Reveal>
              <p className="font-sans text-base md:text-xl text-ink leading-relaxed">
                {project.problem.overview}
              </p>
            </Reveal>

            <div className="pt-6 border-t border-white/10 divide-y divide-white/10">
              {project.problem.points.map((point, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="py-4 flex items-start gap-4">
                    <span className="font-mono text-xs text-gold mt-1">0{i + 1}</span>
                    <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
                      {point}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT I BUILT */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 border-t border-white/10 bg-chassis/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
              02 // Solution
            </span>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight font-bold text-ink">
              <SplitReveal>What I Built</SplitReveal>
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <Reveal>
              <p className="font-sans text-base md:text-xl text-ink leading-relaxed">
                {project.whatIBuilt.overview}
              </p>
            </Reveal>

            <div className="pt-6 border-t border-white/10 divide-y divide-white/10">
              {project.whatIBuilt.details.map((detail, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="py-4 flex items-start gap-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                    <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
                      {detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
              03 // Capabilities
            </span>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight font-bold text-ink">
              <SplitReveal>Key Features</SplitReveal>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {project.keyFeatures.map((feature, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="py-5 flex items-start justify-between gap-4">
                    <span className="font-sans text-base md:text-lg text-ink font-medium">
                      {feature}
                    </span>
                    <span className="font-mono text-xs text-muted/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURE & STACK */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 border-t border-white/10 bg-chassis/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
              04 // Engineering
            </span>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight font-bold text-ink">
              <SplitReveal>Architecture & Stack</SplitReveal>
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <Reveal>
              <p className="font-sans text-base md:text-xl text-ink leading-relaxed">
                {project.architecture.overview}
              </p>
            </Reveal>

            {/* Stack plain text joined by ' · ' per AGENTS.md rule */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.architecture.layers.map((layer, idx) => (
                <Reveal key={idx} delay={idx * 0.08}>
                  <div className="p-6 bg-surface border border-white/10">
                    <div className="font-mono text-xs text-gold uppercase tracking-wider mb-3">
                      {layer.title}
                    </div>
                    <div className="font-mono text-xs md:text-sm text-ink/90 leading-relaxed">
                      {layer.items.join(" · ")}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MY ROLE */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
              05 // Attribution
            </span>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight font-bold text-ink">
              <SplitReveal>My Role</SplitReveal>
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="font-display text-xl md:text-2xl font-bold uppercase text-ink">
                  {project.role.title}
                </span>
                <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 uppercase tracking-wider">
                  {project.role.badge}
                </span>
              </div>
              <p className="font-sans text-sm md:text-base text-muted italic mb-6">
                {project.role.attribution}
              </p>
            </Reveal>

            <div className="divide-y divide-white/10 border-t border-white/10">
              {project.role.details.map((item, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="py-4 flex items-start gap-4">
                    <span className="font-mono text-xs text-muted mt-1">•</span>
                    <p className="font-sans text-sm md:text-base text-ink/90 leading-relaxed">
                      {item}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. LINKS & RESOURCES */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
              06 // Access
            </span>
            <h2 className="font-display text-2xl md:text-4xl uppercase tracking-tight font-bold text-ink">
              <SplitReveal>Project Links</SplitReveal>
            </h2>
          </div>

          <div className="lg:col-span-8 flex flex-wrap items-center gap-6">
            {project.liveUrl && (
              <Reveal>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-ink hover:text-gold transition-colors duration-200"
                >
                  <span>Launch Live Instance</span>
                  <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Reveal>
            )}

            {project.githubUrl && (
              <Reveal delay={0.08}>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted hover:text-ink transition-colors duration-200"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub Repository</span>
                </a>
              </Reveal>
            )}

            {!project.liveUrl && !project.githubUrl && (
              <Reveal>
                <p className="font-sans text-sm text-muted">
                  No public demo or repository is exposed for this project per confidentiality or academic archive policies.
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* 8. BACK TO WORK CTA */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-14 md:py-20 text-center border-t border-white/10">
        <Link
          href="/#work"
          className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 bg-surface/40 font-mono text-xs md:text-sm uppercase tracking-wider text-ink hover:border-gold hover:text-gold hover:bg-surface transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 text-gold" />
          <span>Back to all work</span>
        </Link>
      </div>

      {/* 9. BIDIRECTIONAL CASE STUDY NAVIGATION */}
      <footer className="border-t border-white/10 bg-chassis">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* Previous Project */}
          <Link
            href={`/work/${prevProject.id}`}
            data-cursor="Prev"
            className="group block p-8 md:p-14 transition-colors duration-300 hover:bg-surface/40"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-3">
                  ← Previous Case Study
                </span>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight font-extrabold text-ink group-hover:text-gold transition-colors duration-200 break-words">
                  {prevProject.title}
                </h3>
                <p className="font-mono text-xs md:text-sm text-muted uppercase tracking-wider mt-2">
                  {prevProject.category} · {prevProject.statusBadge}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-mono text-xs text-muted group-hover:text-gold transition-colors">
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Read case study</span>
              </div>
            </div>
          </Link>

          {/* Next Project */}
          <Link
            href={`/work/${nextProject.id}`}
            data-cursor="Next"
            className="group block p-8 md:p-14 text-left md:text-right transition-colors duration-300 hover:bg-surface/40"
          >
            <div className="flex flex-col justify-between h-full items-start md:items-end">
              <div>
                <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-3">
                  Next Case Study →
                </span>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-tight font-extrabold text-ink group-hover:text-gold transition-colors duration-200 break-words">
                  {nextProject.title}
                </h3>
                <p className="font-mono text-xs md:text-sm text-muted uppercase tracking-wider mt-2">
                  {nextProject.category} · {nextProject.statusBadge}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 font-mono text-xs text-muted group-hover:text-gold transition-colors">
                <span>Read case study</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </footer>
    </article>
  );
}
