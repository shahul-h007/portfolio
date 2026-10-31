export interface PlainFact {
  index: string;
  label: string;
  title: string;
  detail: string;
}

export const aboutNarrative =
  "I am a developer from Kerala, India, holding a Bachelor of Computer Applications from Calicut University. I engineer full-stack web applications and software systems with an emphasis on architectural clarity, resilient performance, and purposeful motion. Rather than assembling fragile prototypes, I focus on building reliable software that solves tangible operational problems, while continuously deepening my knowledge in Linux systems, computer networking, and production infrastructure.";

export const plainFacts: PlainFact[] = [
  {
    index: "01",
    label: "CREDENTIALS",
    title: "Bachelor of Computer Applications (BCA)",
    detail: "University of Calicut, Kerala · Rigorous foundations in algorithms, database design, and software engineering methodologies.",
  },
  {
    index: "02",
    label: "ACTIVE ARSENAL",
    title: "Full-Stack Web & Mobile",
    detail: "Hands-on experience shipping production systems with Next.js, TypeScript, Tailwind CSS, Supabase, PostgreSQL, and Flutter.",
  },
  {
    index: "03",
    label: "AVAILABILITY",
    title: "Open for Opportunities",
    detail: "Actively seeking full-time junior developer roles, high-impact engineering teams, and select freelance client commissions.",
  },
];
