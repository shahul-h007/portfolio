export type VentureStatus =
  | "Deployed"
  | "Completed"
  | "In development"
  | "Concept"
  | "Learning";

export interface Venture {
  id: string;
  name: string;
  category: string;
  status: VentureStatus;
  tagline: string;
  description: string;
  link?: string;
}

// AGENTS.md status words: Deployed, Completed, In development, Concept, Learning
// No invented metrics, revenue, or dates.
export const ventures: Venture[] = [
  {
    id: "chronyx",
    name: "Chronyx",
    category: "Tactile Horology & Craft",
    status: "In development",
    tagline:
      "Handcrafted wooden desktop clocks and minimalist mechanical timepieces.",
    description:
      "A physical product venture combining precision woodworking, quiet mechanics, and minimalist timekeeping aesthetics.",
  },
  {
    id: "the-rig-space",
    name: "The Rig Space",
    category: "Workstation Architecture",
    status: "Concept",
    tagline:
      "Ergonomic workspace designs, engineered desk setups, and developer ergonomics.",
    description:
      "Explorations into intentional workstation design, cable routing architecture, and tactile workspace equipment.",
  },
  {
    id: "ell-edition",
    name: "ELL Edition",
    category: "Industrial & Everyday Carry",
    status: "Concept",
    tagline: "Functional goods and minimal personal tools.",
    description:
      "Design concepts focused on durable materials, minimal footprints, and practical daily utility.",
  },
  {
    id: "octave-zero",
    name: "Octave Zero",
    category: "Technical Content & Media",
    status: "In development", // TODO: Confirm status from PORTFOLIO_BRIEF.md
    tagline:
      "Content exploring software craft, developer setups, and product engineering.",
    description:
      "A platform documenting technical builds, engineering perspectives, and real-world software workflows.",
  },
];
