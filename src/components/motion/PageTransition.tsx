"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

interface PageTransitionContextValue {
  navigateWithTransition: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: React.ReactNode }) {
  const { navigateWithTransition } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigateWithTransition(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const targetHrefRef = useRef<string | null>(null);
  const [, startTransition] = useTransition();

  // Handle curtain wipe out whenever pathname changes
  useEffect(() => {
    if (!curtainRef.current) return;

    const curtain = curtainRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsTransitioning(false);
      curtain.style.transform = "scaleY(0)";
      return;
    }

    // If curtain is visible (wiping away)
    gsap.killTweensOf(curtain);
    gsap.to(curtain, {
      scaleY: 0,
      duration: 0.55,
      ease: "power2.inOut",
      transformOrigin: "top",
      onComplete: () => {
        setIsTransitioning(false);
        targetHrefRef.current = null;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("page-transition-complete"));
        }
      },
    });
  }, [pathname]);

  const navigateWithTransition = (href: string) => {
    // If it's hash link on current page or external link, don't curtain
    if (href.startsWith("#") || href.startsWith("http") || href === pathname) {
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !curtainRef.current) {
      router.push(href);
      return;
    }

    if (isTransitioning) return;
    setIsTransitioning(true);
    targetHrefRef.current = href;

    const curtain = curtainRef.current;
    gsap.killTweensOf(curtain);

    // Wipe curtain UP (from bottom to full screen)
    gsap.fromTo(
      curtain,
      {
        scaleY: 0,
        transformOrigin: "bottom",
      },
      {
        scaleY: 1,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () => {
          startTransition(() => {
            router.push(href);
          });

          // Safety timeout in case navigation stalls or same route
          setTimeout(() => {
            if (curtainRef.current) {
              gsap.to(curtainRef.current, {
                scaleY: 0,
                duration: 0.5,
                ease: "power2.inOut",
                transformOrigin: "top",
                onComplete: () => setIsTransitioning(false),
              });
            }
          }, 1200);
        },
      }
    );
  };

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}

      {/* Full-screen transition curtain (never blocks navigation) */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        data-transition-curtain="true"
        className="fixed inset-0 z-[9990] bg-chassis border-t border-b border-gold/30 pointer-events-none"
        style={{
          transform: "scaleY(0)",
          transformOrigin: "bottom",
          pointerEvents: "none",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-px bg-gold/60" />
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}
