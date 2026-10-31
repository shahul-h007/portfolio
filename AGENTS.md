# AGENTS.md (v2) — rules for any coding agent working on this repo

Project: Shahul Hameed's personal developer portfolio, rebuilt from zero in `portfolio-v2`.
Stack: Next.js 15 (App Router, static export), React 19, TypeScript, Tailwind 3.4, **GSAP + ScrollTrigger + Lenis** for motion.
Read this file and `PORTFOLIO_BRIEF.md` before every task. If they conflict, **this file wins** (the brief mentions Three.js; it is now banned).

## 1. Who the site is for
Shahul is a **developer**. Goal: freelance clients and full-time junior developer roles. The site must feel like a premium, professionally engineered product: confident, fast, and full of purposeful motion. Credibility and craft beat decoration.

## 2. Accuracy rules (non-negotiable)
- Never invent employment, clients, revenue, users, metrics, years of experience, dates or outcomes.
- Status words, used exactly: **Deployed**, **Completed**, **In development**, **Concept**, **Learning**.
- BorrowBox is a team project (4 people). Shefeer Portfolio is client work, in development, no invented URL, no private source exposed.
- RenewalDesk WhatsApp reminders are click-to-chat, not automatic messages.
- No skill percentage bars. Separate "used in shipped projects" from "currently learning".
- Project facts come only from `src/content/*` (typed from `PORTFOLIO_BRIEF.md`). If a fact is missing, ask. Do not guess. Never describe a screenshot you did not capture.

## 3. Banned
- **No Three.js, no WebGL, no canvas particles, no 3D globe/spheres/floating blobs.** Do not install `three` or `@react-three/*`.
- No glassmorphism cards, no rounded-2xl bordered cards as the main layout device, no pill/chip tags (stacks are plain text joined by ` · `), no radial glow blobs, no percentage bars, no fake stats.
- No infinite decorative loops except the marquee and a tiny CSS availability pulse.

## 4. Visual language
Palette: canvas `#08080A`, chassis `#0E1015`, surface `#151821`, gold `#D4AF37` (sparingly: 1-2 accents per viewport), cyan `#00E5FF` (rare), text `#F5F5F7`, muted `#8E929E`.
Fonts: Syne (display), Plus Jakarta Sans (body), JetBrains Mono (labels).
Layout: 12-column grid, huge editorial type (display up to ~13vw), hairline `white/10` rules, lots of negative space, square corners, full-bleed sections. Reference sites to *study* (open them in the browser and note techniques): spykercars.com, guillaumecolombel.fr, forgeautomotive.co.uk.

## 5. Motion system (this is what makes it feel advanced)
- One smooth-scroll setup: Lenis driven by `gsap.ticker`, `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.lagSmoothing(0)`.
- One easing language: `power4.out` / `expo.out` for entrances (0.8-1.2s), `power2.inOut` for transitions, stagger 0.04-0.08s.
- Core reusable pieces in `src/components/motion/`: `SplitReveal` (masked line/char rise), `Reveal` (fade-up), `Magnetic`, `Cursor`, `Marquee`, `PageTransition`, `ScrollProgress`.
- Scroll-linked effects use `scrub`; entrances use `once: true`.
- Every effect lives inside `useGSAP` (from `@gsap/react`) with a scope, so it cleans up automatically.
- `gsap.matchMedia()`: wrap motion in `(prefers-reduced-motion: no-preference)`; reduced motion shows final states instantly. Custom cursor and magnetic effects only on `(hover: hover) and (pointer: fine)`.
- Animate only `transform`, `opacity`, `clip-path`. Never layout properties. Use `will-change` only during animation.

## 6. Working rules
- **One prompt = one section.** Do not touch other sections.
- Never run `next build` while `next dev` is running. Stop dev first.
- Never modify or delete the old project folder or `index.legacy.html`.
- Do not push, deploy or open PRs unless asked. Commit after each finished section with a clear message.
- When a section is done: open it in the browser, take screenshots at **390, 768 and 1440 px**, actually look at them, and list anything wrong (overflow, overlap, clipped text, jank, low contrast). Do not write "PASS" unless you looked. If you cannot view the page, say so.
- Final report: 3-5 lines. No long summaries.
