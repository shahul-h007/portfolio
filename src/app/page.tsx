import Hero from "@/components/sections/Hero";
import WorkSection from "@/components/sections/WorkSection";
import SkillsSection from "@/components/sections/SkillsSection";
import JourneySection from "@/components/sections/JourneySection";
import AboutSection from "@/components/sections/AboutSection";
import VenturesSection from "@/components/sections/VenturesSection";
import ContactSection from "@/components/sections/ContactSection";
import { SITE_URL } from "@/config/site";

export default function HomePage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Shahul Hameed",
    jobTitle: "Full-Stack Developer",
    url: SITE_URL,
    image: `${SITE_URL}/images/shahul-portrait.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    sameAs: [
      "https://github.com/shahul-h007",
      "https://www.linkedin.com/in/shahul-hameed-ki",
      "https://x.com/Shahul_hmd404",
      "https://www.instagram.com/shaahul_h/",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Shahul Hameed — Full-Stack Developer",
    url: SITE_URL,
    description:
      "Full-stack developer in Kochi, Kerala. Building web apps, SaaS products, and digital experiences with Next.js, TypeScript, and purposeful motion.",
    publisher: {
      "@type": "Person",
      name: "Shahul Hameed",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
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
    </>
  );
}
