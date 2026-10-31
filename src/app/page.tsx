import Hero from "@/components/sections/Hero";
import WorkSection from "@/components/sections/WorkSection";
import SkillsSection from "@/components/sections/SkillsSection";
import JourneySection from "@/components/sections/JourneySection";
import AboutSection from "@/components/sections/AboutSection";
import VenturesSection from "@/components/sections/VenturesSection";
import ContactSection from "@/components/sections/ContactSection";

export default function HomePage() {
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

      {/* 06 // VENTURES Section */}
      <VenturesSection />

      {/* 07 // CONTACT Section */}
      <ContactSection />
    </main>
  );
}
