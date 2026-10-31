export type ProjectStatus =
  | "Deployed"
  | "Completed"
  | "In development"
  | "Concept"
  | "Learning";

export interface Project {
  id: string;
  title: string;
  category: string;
  status: ProjectStatus;
  summary: string;
  description: string;
  stack: string[];
  team?: string;
  client?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  features: string[];
}

export const projects: Project[] = [
  {
    id: "renewaldesk",
    title: "RenewalDesk",
    category: "SaaS Web Application",
    // Exact status word from AGENTS.md
    status: "In development", // TODO: Confirm exact status (In development vs Deployed) from PORTFOLIO_BRIEF.md
    summary:
      "Small business recurring renewal and customer service tracker.",
    description:
      "A streamlined management system designed for independent service providers and agencies to track recurring subscription dates, renewals, and client communications.",
    // Stack plain text list - no pill tags per AGENTS.md
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"], // TODO: Confirm full stack from PORTFOLIO_BRIEF.md
    // AGENTS.md rule: "RenewalDesk WhatsApp reminders are click-to-chat, not automatic messages."
    features: [
      "Client contract and policy renewal tracking",
      "Click-to-chat WhatsApp reminders for direct client messaging (not automated messages)",
      "Status telemetry and expiration alerts",
      // TODO: Confirm remaining feature bullet points from PORTFOLIO_BRIEF.md
    ],
    // TODO: Confirm live URL and GitHub repo from PORTFOLIO_BRIEF.md
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: "shefeer-portfolio",
    title: "Shefeer Portfolio",
    category: "Client Commission",
    // Exact status word from AGENTS.md
    status: "In development",
    client: true,
    summary:
      "Minimal high-impact portfolio for an independent freelance video editor.",
    description:
      "A bespoke, performance-oriented showcase engineered to highlight high-resolution commercial editing cuts and motion graphics.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"], // TODO: Confirm exact stack from PORTFOLIO_BRIEF.md
    features: [
      "Video work showcase with zero layout shift",
      "Responsive editorial layout and clear client enquiry flow",
      // TODO: Confirm remaining features from PORTFOLIO_BRIEF.md
    ],
    // AGENTS.md rule: "Shefeer Portfolio is client work, in development, no invented URL, no private source exposed."
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: "borrowbox",
    title: "BorrowBox",
    category: "Peer-to-Peer Lending Platform",
    // Exact status word from AGENTS.md
    status: "Completed",
    // AGENTS.md rule: "BorrowBox is a team project (4 people)."
    team: "Team Project (4 people)",
    summary:
      "Community asset sharing and peer-to-peer item lending platform.",
    description:
      "A collaborative platform built to facilitate borrowing and sharing physical equipment among verified community peers.",
    stack: ["React", "Node.js", "Express", "MongoDB"], // TODO: Confirm exact stack from PORTFOLIO_BRIEF.md
    features: [
      "Catalog of shared assets and availability tracking",
      "Request, approval, and item return workflow",
      // TODO: Confirm remaining features from PORTFOLIO_BRIEF.md
    ],
    // TODO: Confirm repo / demo from PORTFOLIO_BRIEF.md
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: "rentflow",
    title: "RentFlow",
    category: "Financial Utility",
    status: "In development", // TODO: Confirm exact status and title from PORTFOLIO_BRIEF.md
    summary:
      "Household expense splitting and tenant utility tracking system.",
    description:
      "A lightweight utility tool designed to manage shared rent payments, recurring utility splits, and settlement transparency.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"], // TODO: Confirm exact stack from PORTFOLIO_BRIEF.md
    features: [
      "Per-tenant cost distribution and invoice log",
      "Split calculations for irregular utility bills",
      // TODO: Confirm features from PORTFOLIO_BRIEF.md
    ],
    liveUrl: undefined,
    githubUrl: undefined,
  },
  {
    id: "devverse",
    title: "Devverse",
    category: "Mobile Application",
    status: "In development", // TODO: Confirm exact status from PORTFOLIO_BRIEF.md
    summary:
      "Developer studio simulation and idle management mobile experience.",
    description:
      "An interactive mobile experience built around software project iterations, bug patching loops, and studio scaling.",
    stack: ["Flutter", "Dart"], // TODO: Confirm stack from PORTFOLIO_BRIEF.md
    features: [
      "Interactive studio growth loops",
      // TODO: Confirm features from PORTFOLIO_BRIEF.md
    ],
    liveUrl: undefined,
    githubUrl: undefined,
  },
];
