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
  statusBadge: string;
  problemStatement: string;
  metaDescription: string;
  stack: string[];
  featured: boolean;
  order: number;
  desktopImage?: string;
  mobileImage?: string;
  previewComing?: boolean;
  previewReason?: string;
  liveUrl?: string;
  githubUrl?: string;
  // Case study specific details
  tagline: string;
  problem: {
    overview: string;
    points: string[];
  };
  whatIBuilt: {
    overview: string;
    details: string[];
  };
  keyFeatures: string[];
  architecture: {
    overview: string;
    layers: { title: string; items: string[] }[];
  };
  role: {
    title: string;
    badge: string;
    attribution: string;
    details: string[];
  };
}

export const projects: Project[] = [
  {
    id: "renewaldesk",
    title: "RenewalDesk",
    category: "SaaS Web Application",
    status: "Deployed",
    statusBadge: "Deployed on Vercel",
    problemStatement:
      "Small service businesses struggle to track upcoming client renewals, leading to forgotten contract dates, chaotic spreadsheets, and lost repeat revenue.",
    metaDescription:
      "RenewalDesk case study: Next.js SaaS for small service businesses to track recurring customer contracts and dispatch WhatsApp reminders.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Razorpay",
    ],
    featured: true,
    order: 1,
    desktopImage: "/images/work/renewaldesk-desktop.png",
    mobileImage: "/images/work/renewaldesk-mobile.png",
    previewComing: false,
    liveUrl: "https://renewaldesk-dun.vercel.app",
    githubUrl: "https://github.com/shahul-h007/renewaldesk",
    tagline: "Small business recurring renewal and customer service tracker.",
    problem: {
      overview:
        "Independent service providers (AC servicing, water purifiers, commercial appliance maintenance) rely heavily on paper diaries or unorganised WhatsApp chats. They consistently miss periodic servicing intervals, leading to customer attrition and missed revenue.",
      points: [
        "Spreadsheet-based customer tracking lacks automated due-date calculation and reminder queues.",
        "Manual client messaging requires retyping customer equipment details and renewal terms repeatedly.",
        "Disorganised service logs create uncertainty regarding past warranty claims and maintenance history.",
      ],
    },
    whatIBuilt: {
      overview:
        "A focused, high-speed SaaS operations hub designed for small service agencies to track customer equipment records, service cycles, and direct client follow-ups from a single command dashboard.",
      details: [
        "Customer and asset registry with configurable periodic maintenance cycles (monthly, quarterly, annual).",
        "Operational follow-up dashboard sorting customers by imminent renewal deadlines.",
        "One-click WhatsApp reminder generation that pre-fills customer contract and equipment specifics.",
        "Dual engine architecture: Cloud PostgreSQL with Supabase, paired with an offline demo mode for quick testing.",
      ],
    },
    keyFeatures: [
      "Follow-up queue and operational renewal board",
      "Click-to-chat WhatsApp reminders with custom pre-filled message templates",
      "Service history logging and warranty period tracking",
      "Customer contact and appliance asset management",
      "Integrated Razorpay subscription and payment workflow",
    ],
    architecture: {
      overview:
        "Built on Next.js App Router for server-rendered speed and SEO, coupled with Supabase for user authentication, row-level security (RLS), and managed PostgreSQL persistence.",
      layers: [
        {
          title: "Frontend & UI",
          items: ["Next.js 14/15 App Router", "TypeScript", "Tailwind CSS", "Lucide Icons"],
        },
        {
          title: "Backend & Database",
          items: ["Supabase Auth", "PostgreSQL", "Row Level Security (RLS)", "Next.js Server Actions"],
        },
        {
          title: "Integrations & Deployment",
          items: ["Razorpay Payment Gateway", "WhatsApp Click-to-Chat API", "Vercel Edge Platform"],
        },
      ],
    },
    role: {
      title: "Solo Developer",
      badge: "Solo Build",
      attribution:
        "Conceived, architected, designed, and developed entirely by Shahul Hameed.",
      details: [
        "Engineered the full frontend interface and database schemas with Supabase RLS policies.",
        "Implemented click-to-chat WhatsApp reminder routing (direct user-initiated messages).",
        "Configured continuous integration and production deployment on Vercel.",
      ],
    },
  },
  {
    id: "rentflow",
    title: "RentFlow",
    category: "Financial Utility Application",
    status: "Deployed",
    statusBadge: "Deployed · Login Required",
    problemStatement:
      "Flatmates and tenants face constant friction when splitting uneven monthly rents, utility spikes, and communal grocery expenses without transparent reconciliation.",
    metaDescription:
      "RentFlow case study: Next.js and Supabase financial utility for shared living to calculate rent shares, log expenses, and balance household debts.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Flutter",
    ],
    featured: true,
    order: 2,
    previewComing: true,
    previewReason: "Live deployment requires tenant authentication (/login)",
    liveUrl: "https://rentflow-sooty.vercel.app",
    githubUrl: "https://github.com/shahul-h007/rentflow",
    tagline: "Household rent and communal shared expense management system.",
    problem: {
      overview:
        "Shared accommodations frequently experience tension over uneven expense splits, delayed utility bill settlements, and lost receipts. Existing generic split apps lack household-specific workflows like room-based rent weights and advance payment roll-overs.",
      points: [
        "Unbalanced room sizes and utility shares require custom mathematical split ratios.",
        "Debt tracking across multiple flatmates often results in circular, unresolved balances.",
        "Lack of an audit trail creates disagreements when settling up at the end of each tenancy cycle.",
      ],
    },
    whatIBuilt: {
      overview:
        "A deterministic rent and shared expense calculator that structures household tenancy costs, computes exact per-member liabilities, and maintains an indisputable settlement history.",
      details: [
        "Deterministic rent distribution engine supporting weighted room shares and variable utility splits.",
        "Member settlement board highlighting outstanding balances and clear settlement instructions.",
        "Carry-forward coverage tracker that accounts for tenants paying advances on behalf of others.",
        "Companion Flutter mobile codebase designed for rapid on-the-go expense entries.",
      ],
    },
    keyFeatures: [
      "Weighted rent distribution and irregular utility splitting engine",
      "Live flatmate settlement dashboard and balance ledger",
      "Coverage-debt tracking with automatic carry-forward logic",
      "Payment verification and receipts logging",
      "Cross-platform Flutter mobile companion application",
    ],
    architecture: {
      overview:
        "Engineered with Next.js and Prisma ORM to interface with PostgreSQL on Supabase, enforcing strict numeric precision for split equations.",
      layers: [
        {
          title: "Web Platform",
          items: ["Next.js App Router", "TypeScript", "Tailwind CSS", "Prisma ORM"],
        },
        {
          title: "Data Layer",
          items: ["Supabase PostgreSQL", "Prisma Migrations", "JWT Session Management"],
        },
        {
          title: "Mobile Companion",
          items: ["Flutter", "Dart", "REST API Client"],
        },
      ],
    },
    role: {
      title: "Solo Developer",
      badge: "Solo Build",
      attribution:
        "Architected, built, and tested end-to-end by Shahul Hameed.",
      details: [
        "Authored the deterministic debt-simplification calculation algorithms in TypeScript.",
        "Configured Prisma data models and automated database migrations.",
        "Developed the responsive desktop web app and initialized the Flutter mobile client.",
      ],
    },
  },
  {
    id: "shefeer-portfolio",
    title: "Shefeer Portfolio",
    category: "Client Commission",
    status: "In development",
    statusBadge: "Client work · In development",
    problemStatement:
      "Independent video editors need high-speed, cinema-grade portfolio platforms that stream high-bitrate commercial cuts without layout shifts or clunky video wrappers.",
    metaDescription:
      "Shefeer Portfolio case study: Custom-engineered digital showcase for freelance editor Shefeer, built with modern Next.js, Tailwind CSS, and fluid motion.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: true,
    order: 3,
    previewComing: true,
    previewReason: "Client work currently in private development",
    liveUrl: undefined,
    githubUrl: undefined,
    tagline: "Cinematic digital portfolio for an independent freelance video editor.",
    problem: {
      overview:
        "Muhammed Shefeer K, an independent freelance video editor based in Kochi, needed a high-impact digital presence to pitch premium commercial directors and agency clients. Standard template sites felt slow, generic, and compromised video playback quality.",
      points: [
        "Generic portfolio templates suffered from heavy scripts and jarring layout shifts during video embeds.",
        "Lack of cohesive dark-room visual styling diminished the perceived production quality of the video work.",
        "Enquiry forms were buried beneath layers of unnecessary navigation, causing dropped leads.",
      ],
    },
    whatIBuilt: {
      overview:
        "A bespoke, minimalist portfolio website engineered to showcase commercial editing showreels, motion graphics, and post-production client services with cinematic elegance.",
      details: [
        "Custom responsive video showcase containers engineered for zero cumulative layout shift (CLS).",
        "Dark visual aesthetic optimized for colourist and video editor presentation.",
        "Structured services menu detailing rates, turnaround windows, and post-production workflows.",
        "Streamlined direct booking and commission enquiry interface.",
      ],
    },
    keyFeatures: [
      "Zero-CLS high-bitrate video showcase containers",
      "Cinematic dark editorial visual theme",
      "Categorized project reel and commercial cuts gallery",
      "Direct client consultation and commission flow",
      "Fully responsive mobile-to-desktop presentation",
    ],
    architecture: {
      overview:
        "Built with Next.js App Router for fast static asset delivery and Tailwind CSS for precise typography and layout control.",
      layers: [
        {
          title: "Frontend Stack",
          items: ["Next.js 15 App Router", "TypeScript", "Tailwind CSS"],
        },
        {
          title: "Media Delivery",
          items: ["Responsive Video Embeds", "Optimized WebP Visuals", "Lazy Media Pipelines"],
        },
      ],
    },
    role: {
      title: "Lead Frontend Engineer",
      badge: "Client Work · In development",
      attribution:
        "Client project commissioned by Muhammed Shefeer K. Private repository maintained with client.",
      details: [
        "Collaborated directly with the client to translate artistic visual preferences into a performant web interface.",
        "Implemented responsive video player containers avoiding layout shift on mobile viewports.",
        "Optimized typography hierarchy, transitions, and accessibility standards.",
      ],
    },
  },
  {
    id: "borrowbox",
    title: "BorrowBox",
    category: "Peer-to-Peer Lending Platform",
    status: "Completed",
    statusBadge: "Academic · Team of 4",
    problemStatement:
      "Purchasing expensive tools, electronics, or equipment used only once or twice is wasteful, yet local communities lack safe, structured ways to borrow from peers.",
    metaDescription:
      "BorrowBox case study: Collaborative peer-to-peer equipment lending platform built with a 4-person team to manage community asset sharing and inventory.",
    stack: [
      "Flutter",
      "Python",
      "Django",
      "SQL",
      "HTML5",
      "CSS3",
    ],
    featured: false,
    order: 4,
    previewComing: true,
    previewReason: "Academic capstone deployment",
    liveUrl: undefined,
    githubUrl: undefined,
    tagline: "Community asset sharing and peer-to-peer item lending platform.",
    problem: {
      overview:
        "People routinely purchase tools, books, and event gear that sit idle for months after a single use. At the same time, peer-to-peer borrowing within college campuses and local communities is hindered by friction in inventory visibility and lack of accountability.",
      points: [
        "No trusted directory exists to discover what physical assets neighbours or campus peers own.",
        "Informal lending leads to forgotten return dates, unreturned items, and damaged property without recourse.",
        "Local shops lack a simple web portal to list rental items alongside community listings.",
      ],
    },
    whatIBuilt: {
      overview:
        "A full-stack collaborative sharing system featuring a cross-platform Flutter mobile client for users, a Python/Django REST API, and a dedicated web view for merchant equipment management.",
      details: [
        "Cross-platform Flutter mobile application for browsing, listing, and requesting items.",
        "Django backend with REST endpoints managing user verification, item availability, and transactions.",
        "Relational SQL database maintaining item schemas, user reputations, and borrow logs.",
        "Merchant web interface for local shops to offer rental equipment to the community.",
      ],
    },
    keyFeatures: [
      "Geolocated item discovery and category filtering",
      "Request, approval, and item return workflow tracking",
      "Peer accountability system with mutual ratings and reviews",
      "Merchant dashboard view for commercial equipment lenders",
      "Clean REST API architecture bridging Flutter client and Django server",
    ],
    architecture: {
      overview:
        "Cross-platform mobile application communicating over REST APIs with a Python Django backend connected to a relational SQL database.",
      layers: [
        {
          title: "Mobile Client",
          items: ["Flutter", "Dart", "HTTP Client", "Mobile UI Components"],
        },
        {
          title: "Backend API",
          items: ["Python", "Django REST Framework", "Authentication Middleware"],
        },
        {
          title: "Database & Web",
          items: ["SQL Database", "HTML5", "CSS3 Merchant Portal"],
        },
      ],
    },
    role: {
      title: "Mobile App Lead & Full-Stack Contributor",
      badge: "Academic · Team of 4",
      attribution:
        "Final-year BCA capstone team project (4 people: Shahul Hameed, Adithya P, Muhammad Ajmal KV, Salmanul Faris).",
      details: [
        "Architected and developed the entire Flutter mobile application from UI designs to API integration.",
        "Collaborated on designing the Django REST API endpoints, authentication flows, and SQL schemas.",
        "Ensured responsive layouts and cross-device testing across multiple Android devices.",
      ],
    },
  },
  {
    id: "devverse",
    title: "Devverse",
    category: "Mobile Game",
    status: "Completed",
    statusBadge: "Personal · Solo",
    problemStatement:
      "Most mobile idle games rely on intrusive pay-to-win mechanics rather than balanced, enjoyable engineering progression systems.",
    metaDescription:
      "Devverse case study: Mobile software studio simulation and idle management game built with Flutter, Dart, SQLite offline saves, and Supabase cloud sync.",
    stack: ["Flutter", "Dart", "Supabase Auth", "SQLite", "AdMob"],
    featured: false,
    order: 5,
    previewComing: true,
    previewReason: "Mobile Android package",
    liveUrl: undefined,
    githubUrl: undefined,
    tagline: "Developer studio simulation and idle management mobile experience.",
    problem: {
      overview:
        "Creating an engaging mobile simulation game demands careful numerical balancing so progression feels rewarding both during active play and while idle, without aggressive monetization loops or battery-draining background tasks.",
      points: [
        "Incremental games frequently suffer from inflation math that breaks game balance at later stages.",
        "Cloud-only saves frustrate mobile players with spotty connectivity, while local-only saves risk data loss.",
        "Excessive ad interruptions ruin player immersion and retention.",
      ],
    },
    whatIBuilt: {
      overview:
        "An idle tycoon game where players build, manage, and scale their own software engineering studio, managing developer talent, bug bounties, project releases, and office expansions.",
      details: [
        "Custom incremental math engine calculating offline earnings and studio progression multipliers.",
        "Modular studio upgrade tree with unlockable technologies and developer specializations.",
        "Hybrid save architecture combining local SQLite persistence with Supabase cloud backup.",
        "Full production-ready Android packaging with customized UI animations.",
      ],
    },
    keyFeatures: [
      "Software studio simulation and modular progression tree",
      "Offline idle calculation engine with balance safeguards",
      "Hybrid local-first SQLite persistence with Supabase Cloud Sync",
      "Custom responsive mobile UI built entirely in Flutter",
      "Integrated audio feedback, settings controls, and release preparation",
    ],
    architecture: {
      overview:
        "Engineered solo in Flutter with Dart, utilizing Provider state management and dual-layer data persistence for instant offline play and optional cloud sync.",
      layers: [
        {
          title: "Engine & UI",
          items: ["Flutter", "Dart", "Provider State Management", "Custom Canvas & Vector Graphics"],
        },
        {
          title: "Persistence",
          items: ["SQLite (Local)", "Supabase Auth & Cloud Database (Remote)"],
        },
        {
          title: "Platform & Tooling",
          items: ["Android NDK / Gradle", "AdMob SDK Hooks", "Audio Player Plugins"],
        },
      ],
    },
    role: {
      title: "Solo Developer & Game Designer",
      badge: "Personal · Solo",
      attribution:
        "100% conceived, designed, coded, and packaged solo by Shahul Hameed.",
      details: [
        "Designed all core mechanics, idle math formulas, and upgrade progression trees from scratch.",
        "Built the user interface, custom state controllers, and persistent database layers.",
        "Compiled and packaged production-ready Android APK binaries.",
      ],
    },
  },
];
