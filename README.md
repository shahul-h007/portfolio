# Shahul Hameed — Personal Developer Portfolio

Personal portfolio website for **Shahul Hameed**, full-stack software developer and systems builder based in Kochi, Kerala.

Built with Next.js 15 App Router (static export), React 19, TypeScript, Tailwind CSS 3.4, and a motion system powered by GSAP, ScrollTrigger, and Lenis inertia scrolling.

---

## Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, Static HTML Export)
- **UI Library**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4 (custom design tokens: `#08080A` canvas, `#0E1015` chassis, `#151821` surface, `#D4AF37` gold)
- **Motion & Scrolling**: GSAP 3, ScrollTrigger, `@gsap/react` (`useGSAP`), Lenis smooth scrolling
- **Icons**: Lucide React
- **Typography**: Syne (display), Plus Jakarta Sans (body), JetBrains Mono (telemetry/code)

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm (or pnpm / yarn)

### 1. Installation

```bash
git clone https://github.com/shahul-h007/shahul-h007.github.io.git
cd portfolio-v2
npm install
```

### 2. Environment Variables

Create a `.env.local` file for local development (copy from `.env.example`):

```bash
# Optional: Set the canonical site URL (defaults to https://shahul.runs-on.dev if unset)
NEXT_PUBLIC_SITE_URL=https://shahul.runs-on.dev

# Optional: Web3Forms access key for contact transmission
NEXT_PUBLIC_WEB3FORMS_KEY=
```

*Note: If `NEXT_PUBLIC_WEB3FORMS_KEY` is not provided, the contact form honestly informs the visitor that transmission is not configured yet rather than failing silently.*

### 3. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Important**: Never run `npm run build` or `next build` while `npm run dev` is actively running. Stop the development server before running a production build.

---

## Production Build & Static Export

To create the optimized static export:

```bash
npm run build
```

The static HTML, JavaScript, CSS, and asset files are exported into the `./out` directory.

To test the exported build locally:

```bash
npx serve out -p 3000
```

---

## Deploying to Vercel

1. **Push your code to GitHub**:
   Push the repository to your GitHub account.

2. **Import Project into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new) and click **Add New...** > **Project**.
   - Import your portfolio repository.

3. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: Set to your production URL (e.g. `https://shahul.runs-on.dev`).
     *Changing this variable in Vercel automatically updates `metadataBase`, canonical URLs, Open Graph tags, `sitemap.xml`, and `robots.txt` without editing source code.*
   - `NEXT_PUBLIC_WEB3FORMS_KEY`: Your Web3Forms access key for contact form delivery.

4. **Deploy**:
   - Leave build settings at default (`npm run build` with Next.js framework preset).
   - Click **Deploy**.

5. **Configure Custom Domain**:
   - In your Vercel Project Dashboard, navigate to **Settings** > **Domains**.
   - Enter your `runs-on.dev` or custom domain (e.g. `shahul.runs-on.dev`).
   - Follow Vercel's DNS verification instructions to add the CNAME / A record.

---

## Audit & Verification Standards

- **Static HTML Export**: Clean `out/` export with all project case-study subpaths (`/work/<slug>/index.html`).
- **SEO & Metadata**: Automatically generated static `sitemap.xml` and `robots.txt`, 1200x630 Open Graph image, and SVG favicon.
- **Accessibility & Motion**: Reduced-motion compliance across all GSAP and Lenis interactions.
