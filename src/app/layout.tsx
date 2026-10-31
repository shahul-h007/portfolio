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

export const metadata: Metadata = {
  title: "Shahul Hameed — Developer",
  description:
    "Personal portfolio of Shahul Hameed. Full-stack developer building web applications and digital products.",
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
