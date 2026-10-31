"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/motion/SmoothScroll";

export default function Footer() {
  const lenis = useLenis();
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-canvas text-ink border-t border-white/10 py-10 md:py-12 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-muted">
          
          {/* Location & Live Local Time (Asia/Kolkata) */}
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-ink font-medium">Kochi, Kerala</span>
            <span className="text-white/20">|</span>
            <span suppressHydrationWarning>
              {timeString ? `${timeString} IST` : "IST"}
            </span>
          </div>

          {/* Copyright Line */}
          <div className="text-center text-muted/70">
            © {new Date().getFullYear()} Shahul Hameed. All rights reserved.
          </div>

          {/* Smooth Lenis Back to Top */}
          <div>
            <button
              onClick={handleBackToTop}
              className="group inline-flex items-center gap-2 uppercase tracking-wider text-muted hover:text-gold transition-colors duration-200"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-1" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
