export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  fullName: string;
  role: string;
  headline: string;
  location: string;
  availability: {
    status: string;
    notice: string;
  };
  nav: NavItem[];
  social: SocialLink[];
  bio: {
    short: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Shahul Hameed",
  fullName: "Shahul Hameed KI",
  role: "Full-Stack Developer",
  headline:
    "Building web applications, digital products, and engineered experiences.",
  location: "Kerala, India",
  availability: {
    status:
      "Available for full-time junior developer roles & select freelance projects",
    notice: "Open to work",
  },
  nav: [
    { label: "Hero", href: "#hero" },
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Journey", href: "#journey" },
    { label: "About", href: "#about" },
    { label: "Ventures", href: "#ventures" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    {
      platform: "GitHub",
      url: "https://github.com/shahul-h007",
      label: "github.com/shahul-h007",
    },
    {
      platform: "LinkedIn",
      // TODO: Confirm exact LinkedIn profile handle from PORTFOLIO_BRIEF.md
      url: "https://linkedin.com/in/",
      label: "LinkedIn Profile",
    },
    {
      platform: "Email",
      // TODO: Confirm primary contact email from PORTFOLIO_BRIEF.md
      url: "mailto:",
      label: "Direct Transmission",
    },
  ],
  bio: {
    short:
      "Full-stack developer focused on modern web applications, clean architecture, and purposeful motion. BCA graduate.",
  },
};
