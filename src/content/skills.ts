export interface SkillCategory {
  title: string;
  description?: string;
  skills: string[];
}

export interface SkillsData {
  shipped: SkillCategory[];
  learning: SkillCategory[];
}

// AGENTS.md rules:
// - No skill percentage bars
// - Separate "used in shipped projects" from "currently learning"
export const skillsData: SkillsData = {
  shipped: [
    {
      title: "Frontend Engineering",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "JavaScript (ES6+)",
        "Tailwind CSS",
        "HTML5 / Semantic DOM",
        "CSS3 / Modern Layouts",
      ],
    },
    {
      title: "Backend & APIs",
      skills: [
        "Node.js",
        "REST APIs",
        "Django", // TODO: Confirm from PORTFOLIO_BRIEF.md
        "Express",
      ],
    },
    {
      title: "Databases & Storage",
      skills: [
        "PostgreSQL",
        "Supabase",
        "SQLite",
        "MongoDB",
      ],
    },
    {
      title: "Tools & Workflow",
      skills: [
        "Git",
        "GitHub",
        "VS Code",
        "Figma",
      ],
    },
  ],
  learning: [
    {
      title: "Currently Expanding",
      description: "Active technical competencies being developed in production-like environments",
      skills: [
        "Linux System Administration",
        "Computer Networking Fundamentals",
        "Docker & Containerization",
        "DevOps Pipelines",
      ],
    },
  ],
};
