export type SkillTag = "Shipped" | "Learning";

export interface SkillItem {
  name: string;
  tag: SkillTag;
  context?: string;
}

export interface SkillCategoryRow {
  id: string;
  index: string;
  title: string;
  skills: SkillItem[];
}

export const skillsCatalog: SkillCategoryRow[] = [
  {
    id: "frontend",
    index: "01",
    title: "Frontend",
    skills: [
      { name: "Next.js", tag: "Shipped", context: "RenewalDesk, RentFlow, Shefeer Portfolio" },
      { name: "React", tag: "Shipped", context: "Web clients & dynamic UI" },
      { name: "TypeScript", tag: "Shipped", context: "Strict typing across all builds" },
      { name: "JavaScript", tag: "Shipped", context: "Modern ES6+ fundamentals" },
      { name: "Tailwind CSS", tag: "Shipped", context: "Design systems & fluid scaling" },
      { name: "HTML5 / CSS3", tag: "Shipped", context: "Semantic DOM & accessibility" },
    ],
  },
  {
    id: "backend",
    index: "02",
    title: "Backend",
    skills: [
      { name: "Node.js", tag: "Shipped", context: "Runtime & server actions" },
      { name: "Python / Django", tag: "Shipped", context: "BorrowBox REST backend" },
      { name: "REST APIs", tag: "Shipped", context: "Endpoint contracts & security" },
      { name: "Prisma ORM", tag: "Shipped", context: "RentFlow schema & migrations" },
    ],
  },
  {
    id: "databases",
    index: "03",
    title: "Databases",
    skills: [
      { name: "PostgreSQL", tag: "Shipped", context: "Relational persistence via Supabase" },
      { name: "Supabase", tag: "Shipped", context: "Auth, Storage, RLS policies" },
      { name: "SQLite", tag: "Shipped", context: "Devverse local offline database" },
      { name: "SQL", tag: "Shipped", context: "Queries & schema design" },
    ],
  },
  {
    id: "mobile",
    index: "04",
    title: "Mobile",
    skills: [
      { name: "Flutter", tag: "Shipped", context: "Devverse, BorrowBox, RentFlow companion" },
      { name: "Dart", tag: "Shipped", context: "Reactive state & mobile architecture" },
      { name: "Android SDK", tag: "Shipped", context: "Release compilation & packaging" },
    ],
  },
  {
    id: "devops",
    index: "05",
    title: "DevOps & Infrastructure",
    skills: [
      { name: "Linux Administration", tag: "Learning", context: "Server configuration & process control" },
      { name: "Computer Networking", tag: "Learning", context: "Protocols, routing, DNS & subnets" },
      { name: "SSH & Remote Access", tag: "Learning", context: "Key pairs & remote management" },
      { name: "Nginx", tag: "Learning", context: "Reverse proxying & SSL termination" },
      { name: "SELinux", tag: "Learning", context: "Mandatory access controls & policies" },
      { name: "LVM & NFS", tag: "Learning", context: "Volume management & network shares" },
      { name: "Docker", tag: "Learning", context: "Containers & image orchestration" },
      { name: "CI/CD Pipelines", tag: "Learning", context: "Automated test & deploy workflows" },
    ],
  },
  {
    id: "tools",
    index: "06",
    title: "Tools",
    skills: [
      { name: "Git & GitHub", tag: "Shipped", context: "Version control & collaboration" },
      { name: "VS Code", tag: "Shipped", context: "Primary development environment" },
      { name: "Vercel", tag: "Shipped", context: "Continuous deployment & edge hosting" },
      { name: "Razorpay API", tag: "Shipped", context: "Payment gateway integration" },
      { name: "Figma", tag: "Shipped", context: "Interface wireframing & prototyping" },
    ],
  },
];
