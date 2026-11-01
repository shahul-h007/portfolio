"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/components/motion/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

interface NavLinkItem {
  num: string;
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavLinkItem[] = [
  { num: "01", label: "Work", href: "/#work", id: "work" },
  { num: "02", label: "Skills", href: "/#skills", id: "skills" },
  { num: "03", label: "Journey", href: "/#journey", id: "journey" },
  { num: "04", label: "About", href: "/#about", id: "about" },
  { num: "05", label: "Contact", href: "/#contact", id: "contact" },
];

const MOBILE_NAV_ITEMS: NavLinkItem[] = [
  { num: "00", label: "Home", href: "/", id: "home" },
  ...NAV_ITEMS,
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();

  const isWorkPage = pathname?.startsWith("/work");
  const [activeId, setActiveId] = useState<string>(isWorkPage ? "work" : "");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Keep activeId in sync with route changes
  useEffect(() => {
    if (isWorkPage) {
      setActiveId("work");
    } else if (pathname === "/" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      if (hashId) setActiveId(hashId);
    }
  }, [pathname, isWorkPage]);

  // Scroll hide / return behavior + active section indicator via ScrollTrigger (only on home page)
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      // 1. Hide on scroll down, show on scroll up
      const scrollTrigger = ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 100) {
            // Scrolling down
            gsap.to(nav, {
              yPercent: -100,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else if (self.direction === -1) {
            // Scrolling up
            gsap.to(nav, {
              yPercent: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        },
      });

      // 2. Track active section ONLY on the home page
      const triggers: ScrollTrigger[] = [];
      if (pathname === "/") {
        NAV_ITEMS.forEach((item) => {
          const el = document.getElementById(item.id);
          if (el) {
            const st = ScrollTrigger.create({
              trigger: el,
              start: "top 45%",
              end: "bottom 45%",
              onEnter: () => setActiveId(item.id),
              onEnterBack: () => setActiveId(item.id),
            });
            triggers.push(st);
          }
        });
      }

      return () => {
        scrollTrigger.kill();
        triggers.forEach((st) => st.kill());
      };
    },
    { scope: navRef, dependencies: [pathname] }
  );

  // Mobile menu scroll lock and focus trap
  useEffect(() => {
    if (isMobileOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";

      // Animate mobile links rising in with stagger
      if (mobileLinksRef.current) {
        const linkInners =
          mobileLinksRef.current.querySelectorAll(".mobile-link-inner");
        gsap.fromTo(
          linkInners,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: "power4.out",
          }
        );
      }

      // Keyboard handler for Escape and Focus Trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileOpen(false);
          return;
        }

        if (e.key === "Tab" && mobileMenuRef.current) {
          const focusables = mobileMenuRef.current.querySelectorAll<
            HTMLAnchorElement | HTMLButtonElement
          >("a[href], button:not([disabled])");
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        lenis?.start();
        document.body.style.overflow = "";
      };
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [isMobileOpen, lenis]);

  const handleLinkClick = (item: NavLinkItem, e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, "", item.href);
      if (lenis) {
        lenis.scrollTo("#" + item.id, { duration: 1.2 });
      } else {
        const el = document.getElementById(item.id);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleMobileLinkClick = (item: NavLinkItem, e: React.MouseEvent) => {
    setIsMobileOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, "", item.href);
      if (item.id === "home") {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        if (lenis) {
          lenis.scrollTo("#" + item.id, { duration: 1.2 });
        } else {
          const el = document.getElementById(item.id);
          el?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 pointer-events-auto"
      >
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between h-20 px-4 sm:px-6 md:px-12">
          {/* Logo & Contextual Back Link on Case Studies */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              data-cursor="Home"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.history.pushState(null, "", "/");
                  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="font-display font-extrabold text-2xl tracking-tighter text-ink hover:text-gold transition-colors focus-visible:outline-gold shrink-0"
              aria-label="SH — Shahul Hameed Homepage"
            >
              SH
            </Link>

            {isWorkPage && (
              <div className="flex items-center gap-2 pl-3 border-l border-white/10 font-mono text-xs">
                <Link
                  href="/#work"
                  className="inline-flex items-center gap-1.5 uppercase tracking-wider text-muted hover:text-gold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-gold" />
                  <span>All work</span>
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Links in Mono */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item, e)}
                  data-cursor="Select"
                  className={`font-mono text-xs tracking-wider transition-colors flex items-center gap-2 group ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="text-[10px] text-muted/60 group-hover:text-gold transition-colors">
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-expanded={isMobileOpen}
            aria-label="Open navigation menu"
            className="md:hidden font-mono text-xs tracking-wider uppercase text-ink px-3 py-1.5 border border-white/20 bg-chassis/40 hover:border-gold/50 transition-colors shrink-0"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Overlay */}
      {isMobileOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-[100] bg-canvas flex flex-col justify-between p-6 sm:p-8 md:hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="font-display font-bold text-2xl tracking-tight text-ink"
            >
              SH
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation menu"
              className="font-mono text-xs tracking-wider uppercase text-muted hover:text-gold px-3 py-1.5 border border-white/10 transition-colors"
            >
              Close [ESC]
            </button>
          </div>

          {/* Large Syne Links */}
          <nav
            ref={mobileLinksRef}
            className="flex flex-col space-y-4 my-auto"
            aria-label="Mobile navigation"
          >
            {MOBILE_NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <div key={item.id} className="overflow-hidden">
                  <Link
                    href={item.href}
                    onClick={(e) => handleMobileLinkClick(item, e)}
                    className={`mobile-link-inner flex items-baseline gap-4 py-2 font-display text-4xl sm:text-5xl font-extrabold tracking-tight transition-colors ${
                      isActive ? "text-gold" : "text-ink hover:text-gold"
                    }`}
                  >
                    <span className="font-mono text-xs text-muted/50 font-normal">
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-gold self-center ml-2 inline-block" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Footer Meta Row in Mobile Menu */}
          <div className="border-t border-white/10 pt-4 font-mono text-[10px] tracking-wider text-muted flex justify-between items-center">
            <span>Kochi, Kerala</span>
            <span className="text-gold">Open to Work</span>
          </div>
        </div>
      )}
    </>
  );
}
