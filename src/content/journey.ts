export interface JourneyPanel {
  index: string;
  phase: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
}

export const journeyData: JourneyPanel[] = [
  {
    index: "01",
    phase: "PHASE 01 // FOUNDATION",
    title: "Computer Science Foundations",
    subtitle: "BCA · University of Calicut",
    body: "Underwent formal undergraduate training in the Bachelor of Computer Applications programme at the University of Calicut. Built a rigorous core in algorithmic problem-solving, relational databases, data structures, and computer architecture with C, Python, and SQL before transitioning to modern full-stack web and mobile systems.",
    tags: ["Algorithms & Theory", "Relational SQL", "C & Python", "Calicut University"],
  },
  {
    index: "02",
    phase: "PHASE 02 // BUILDING",
    title: "Shipping Production Software",
    subtitle: "Web Applications, SaaS & Mobile",
    body: "Turned technical knowledge into real deployed products. Conceived and shipped RenewalDesk (SaaS customer renewal tracker with WhatsApp routing), RentFlow (deterministic tenant expense splitting engine), Devverse (solo-developed Flutter mobile game with offline saves), BorrowBox (collaborative 4-person academic lending system), and client engineering commissions.",
    tags: ["RenewalDesk (SaaS)", "RentFlow (Utility)", "Devverse (Mobile)", "BorrowBox (Team)", "Client Commissions"],
  },
  {
    index: "03",
    phase: "PHASE 03 // LEARNING NOW",
    title: "Systems & Infrastructure",
    subtitle: "Linux, Networking & DevOps",
    body: "Actively expanding engineering depth beyond application code into production systems. Developing hands-on competencies in Linux system administration, networking protocols, SSH security, Nginx configuration, storage management with LVM and NFS, SELinux enforcement, Docker containerisation, and automated CI/CD deployment pipelines.",
    tags: ["Linux Administration", "Computer Networking", "Docker & Containers", "Nginx & SSH", "CI/CD Concepts"],
  },
];
