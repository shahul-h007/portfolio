import Hero from "@/components/sections/Hero";
import WorkSection from "@/components/sections/WorkSection";
import SkillsSection from "@/components/sections/SkillsSection";
import JourneySection from "@/components/sections/JourneySection";
import AboutSection from "@/components/sections/AboutSection";

export default function HomePage() {
  const placeholderSections = [
    { id: "ventures", label: "06 // VENTURES" },
    { id: "contact", label: "07 // CONTACT" },
  ];

  return (
    <main className="w-full">
      {/* 01 // HERO Section */}
      <Hero />

      {/* 02 // WORK Section */}
      <WorkSection />

      {/* 03 // SKILLS Section */}
      <SkillsSection />

      {/* 04 // JOURNEY Section */}
      <JourneySection />

      {/* 05 // ABOUT Section */}
      <AboutSection />

      {/* Remaining Placeholder Sections (untouched per working rules) */}
      {placeholderSections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className={`min-h-screen flex flex-col justify-center items-center border-b border-white/10 p-8 ${
            idx % 2 === 0 ? "bg-canvas" : "bg-chassis"
          }`}
        >
          <div className="container mx-auto flex flex-col items-center justify-center text-center">
            <span className="font-mono text-sm tracking-widest text-gold mb-3 uppercase">
              Section Placeholder
            </span>
            <h2 className="font-mono text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ink">
              {section.label}
            </h2>
            <p className="font-mono text-xs text-muted mt-4">
              Anchor: #{section.id}
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}
