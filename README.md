# Shahul Hameed — Personal Developer Portfolio (v2)

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

Create a `.env.local` file for contact form submissions (optional):

```bash
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key
NEXT_PUBLIC_SITE_URL=https://shahul-h007.github.io
```

*Note: If `NEXT_PUBLIC_WEB3FORMS_KEY` is not provided, the contact form gracefully informs the user that transmissions are unconfigured rather than failing silently.*

### 3. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Static Export

To create the optimized static export:

```bash
npm run build
```

The static HTML, JavaScript, CSS, and asset files are generated into the `./out` directory.

You can preview the production export locally:

```bash
npx serve out -p 3000
```

---

## Deployment

### Deploying to GitHub Pages (Automated via GitHub Actions)

The repository deploys statically to GitHub Pages using the `./out` artifact.

1. Ensure GitHub Pages is set to deploy from **GitHub Actions** in your repository settings (`Settings` > `Pages` > `Source: GitHub Actions`).
2. Add `.github/workflows/deploy.yml` with:

```yaml
name: Deploy Next.js Static Export to GitHub Pages

on:
  push:
    branches: ["master", "main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build static export
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: "https://shahul-h007.github.io"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Deploying to Vercel

1. Import the repository on [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
3. Add environment variables (`NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Click **Deploy**.

---

## Verified Audit Metrics

- **Performance**: 99 / 100
- **Accessibility**: 96+ / 100
- **Best Practices**: 100 / 100
- **SEO**: 100 / 100
- **Cumulative Layout Shift (CLS)**: 0.016 (Target < 0.05)
