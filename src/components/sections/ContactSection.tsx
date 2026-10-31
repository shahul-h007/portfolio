"use client";

import React, { useState, useRef } from "react";
import { ArrowUpRight, Check, Send, AlertCircle, Copy } from "lucide-react";
import { siteConfig } from "@/content/site";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "unconfigured">("idle");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCopyEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(siteConfig.email).catch(() => {});
    }
    setCopiedEmail(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopiedEmail(false);
    }, 2500);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Please provide your name.";
    }
    if (!formData.email.trim()) {
      errors.email = "Please provide your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errors.message = "Please write a message.";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    // Honest check: if key is missing or not configured
    if (!accessKey || accessKey.trim() === "" || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setSubmitStatus("unconfigured");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || `Inquiry from ${formData.name}`,
          message: formData.message,
          from_name: "Portfolio Contact Form",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setFormErrors({});
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 w-full bg-chassis text-ink border-t border-white/10 pt-24 md:pt-36 pb-20 md:pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Top Meta Line: Open for work */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-12 font-mono text-xs text-muted">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-ink uppercase tracking-wider font-medium">
              Available for Hire
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="block sm:inline">Open to freelance projects & full-time developer roles</span>
          </div>
          <span className="text-gold tracking-widest uppercase">06 // INITIATE</span>
        </div>

        {/* Huge Display Headline */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-display text-[clamp(1.85rem,7vw,5.5rem)] uppercase tracking-tight font-extrabold text-ink leading-[1.05] break-words">
            <SplitReveal>Let's build something.</SplitReveal>
          </h2>
        </div>

        {/* Large Magnetic Email Link with Instant Copy Confirmation */}
        <div className="mb-16 md:mb-24 pb-12 border-b border-white/10">
          <div className="font-mono text-xs text-gold uppercase tracking-widest mb-3">
            Direct Transmission
          </div>
          <div className="relative inline-block max-w-full">
            <Magnetic>
              <a
                href={`mailto:${siteConfig.email}`}
                onClick={handleCopyEmail}
                data-cursor="Copy"
                className="group inline-flex items-center gap-2 sm:gap-3 font-display text-[clamp(1.1rem,5vw,3.75rem)] font-bold uppercase tracking-tight text-ink hover:text-gold transition-colors duration-200 break-all sm:break-normal"
              >
                <span>{siteConfig.email}</span>
                <Copy className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-muted group-hover:text-gold transition-transform duration-200 group-hover:scale-110 shrink-0" />
              </a>
            </Magnetic>

            {/* Tiny "Copied" floating confirmation badge */}
            {copiedEmail && (
              <span className="absolute -top-7 right-0 md:left-auto font-mono text-[11px] text-canvas bg-gold px-2 py-0.5 font-bold tracking-wider uppercase animate-fade-in flex items-center gap-1 shadow-lg pointer-events-none">
                <Check className="w-3 h-3" />
                <span>Copied to clipboard</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <p className="font-mono text-xs text-muted/60">
              Click to copy address.
            </p>
            <span className="text-white/20">·</span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-mono text-xs text-muted hover:text-gold underline transition-colors"
            >
              Open in email client ↗
            </a>
          </div>
        </div>

        {/* Grid: Contact Form (Left) & Social Channels (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-1">
                Dispatch A Message
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-ink">
                Project Enquiry or Introduction
              </h3>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="font-mono text-xs uppercase tracking-wider text-muted block mb-2"
                >
                  Your Name <span className="text-gold">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
                  }}
                  placeholder="e.g. Maya Sharma"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-ink placeholder:text-muted/30 focus:border-gold focus:outline-none transition-colors duration-200 text-sm md:text-base font-sans"
                />
                {formErrors.name && (
                  <p className="font-mono text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="font-mono text-xs uppercase tracking-wider text-muted block mb-2"
                >
                  Email Address <span className="text-gold">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-ink placeholder:text-muted/30 focus:border-gold focus:outline-none transition-colors duration-200 text-sm md:text-base font-sans"
                />
                {formErrors.email && (
                  <p className="font-mono text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="font-mono text-xs uppercase tracking-wider text-muted block mb-2"
                >
                  Subject / Scope
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Full-time role / Freelance project / Technical chat"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-ink placeholder:text-muted/30 focus:border-gold focus:outline-none transition-colors duration-200 text-sm md:text-base font-sans"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="font-mono text-xs uppercase tracking-wider text-muted block mb-2"
                >
                  Message <span className="text-gold">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (formErrors.message) setFormErrors({ ...formErrors, message: "" });
                  }}
                  placeholder="Details regarding your team, product requirements, or project timeline..."
                  className="w-full bg-transparent border-b border-white/20 py-3 text-ink placeholder:text-muted/30 focus:border-gold focus:outline-none transition-colors duration-200 text-sm md:text-base font-sans resize-y"
                />
                {formErrors.message && (
                  <p className="font-mono text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.message}</span>
                  </p>
                )}
              </div>

              {/* Status Feedbacks */}
              {submitStatus === "unconfigured" && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-300 leading-relaxed">
                  Notice: Contact form transmission is not configured yet (missing NEXT_PUBLIC_WEB3FORMS_KEY). Please email directly at{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline text-gold font-semibold">
                    {siteConfig.email}
                  </a>.
                </div>
              )}

              {submitStatus === "success" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Message delivered successfully. I will review and reply promptly.</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 font-mono text-xs text-red-300 leading-relaxed">
                  Transmission failed. Please dispatch your email directly to{" "}
                  <a href={`mailto:${siteConfig.email}`} className="underline text-gold">
                    {siteConfig.email}
                  </a>.
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-ink text-canvas font-mono text-xs md:text-sm uppercase tracking-wider font-semibold hover:bg-gold hover:text-canvas transition-colors duration-200 inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Transmitting...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Social Channels Ruled List */}
          <div className="lg:col-span-5">
            <div className="mb-8">
              <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                Connected Networks
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight text-ink">
                Public Profiles
              </h3>
            </div>

            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {siteConfig.social.map((channel, i) => (
                <Reveal key={channel.platform} delay={i * 0.06}>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-5 flex items-center justify-between transition-colors duration-200 hover:bg-surface/20 px-2"
                  >
                    <div>
                      <div className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-ink group-hover:text-gold transition-colors duration-200">
                        {channel.platform}
                      </div>
                      <div className="font-mono text-xs text-muted tracking-wider">
                        {channel.handle}
                      </div>
                    </div>
                    <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-muted group-hover:text-gold group-hover:border-gold/40 transition-all duration-200">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 p-6 bg-surface/30 border border-white/10">
              <div className="font-mono text-xs text-gold uppercase tracking-wider mb-2">
                Response Guarantee
              </div>
              <p className="font-sans text-xs md:text-sm text-muted leading-relaxed">
                Direct messages sent to <span className="text-ink font-mono">{siteConfig.email}</span> receive responses typically within 24–48 hours for contract or employment discussions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
