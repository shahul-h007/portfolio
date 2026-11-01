export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface SiteConfig {
  name: string;
  fullName: string;
  role: string;
  headline: string;
  location: string;
  email: string;
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
  location: "Kochi, Kerala",
  email: "kishahul123@gmail.com",
  availability: {
    status: "Open to freelance projects and full-time roles",
    notice: "Available for hire",
  },
  nav: [
    { label: "Work", href: "/#work" },
    { label: "Skills", href: "/#skills" },
    { label: "Journey", href: "/#journey" },
    { label: "About", href: "/#about" },
    { label: "Ventures", href: "/#ventures" },
    { label: "Contact", href: "/#contact" },
  ],
  social: [
    {
      platform: "GitHub",
      url: "https://github.com/shahul-h007",
      handle: "shahul-h007",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/shahul-hameed-ki",
      handle: "shahul-hameed-ki",
    },
    {
      platform: "X",
      url: "https://x.com/Shahul_hmd404",
      handle: "@Shahul_hmd404",
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/shaahul_h/",
      handle: "@shaahul_h",
    },
  ],
  bio: {
    short:
      "Full-stack developer focused on modern web applications, clean architecture, and purposeful motion. BCA graduate from Calicut University.",
  },
};
