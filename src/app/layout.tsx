import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Cursor from "@/components/motion/Cursor";
import Intro from "@/components/motion/Intro";
import PageTransition from "@/components/motion/PageTransition";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";
import { IntroProvider } from "@/context/IntroContext";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shahul-h007.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shahul Hameed — Full-Stack Developer",
    template: "%s | Shahul Hameed",
  },
  description:
    "Personal portfolio of Shahul Hameed. Full-stack developer focused on modern web applications, clean architecture, and purposeful motion.",
  keywords: [
    "Shahul Hameed",
    "Full-Stack Developer",
    "Software Engineer",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "GSAP",
    "Kochi",
    "Kerala",
  ],
  authors: [{ name: "Shahul Hameed", url: "https://github.com/shahul-h007" }],
  creator: "Shahul Hameed",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Shahul Hameed — Full-Stack Developer",
    description:
      "Personal portfolio of Shahul Hameed. Full-stack developer focused on modern web applications, clean architecture, and purposeful motion.",
    siteName: "Shahul Hameed Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shahul Hameed — Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shahul Hameed — Full-Stack Developer",
    description:
      "Personal portfolio of Shahul Hameed. Full-stack developer focused on modern web applications, clean architecture, and purposeful motion.",
    creator: "@Shahul_hmd404",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-canvas text-ink antialiased selection:bg-gold/30 selection:text-gold relative">
        <IntroProvider>
          <PageTransition>
            <SmoothScroll>
              <ScrollProgress />
              <Cursor />
              <Intro />
              <Navbar />
              <div className="relative z-10 min-h-screen flex flex-col">
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
            </SmoothScroll>
          </PageTransition>
        </IntroProvider>
      </body>
    </html>
  );
}
