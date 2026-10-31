import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem", // 16px mobile gutter
        md: "2rem", // 32px desktop gutter
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        canvas: "#08080A",
        chassis: "#0E1015",
        surface: "#151821",
        gold: "#D4AF37",
        cyan: "#00E5FF",
        ink: "#F5F5F7",
        muted: "#8E929E",
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3.5rem, 10vw + 0.5rem, 13vw)",
          { lineHeight: "0.9", letterSpacing: "-0.04em" },
        ],
        "display-lg": [
          "clamp(2.5rem, 6vw + 0.5rem, 6.5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em" },
        ],
        "display-md": [
          "clamp(1.75rem, 3.5vw + 0.5rem, 3.5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.02em" },
        ],
        body: [
          "clamp(1rem, 0.4vw + 0.85rem, 1.125rem)",
          { lineHeight: "1.6" },
        ],
        "label-mono": [
          "clamp(0.75rem, 0.25vw + 0.7rem, 0.875rem)",
          { lineHeight: "1.4", letterSpacing: "0.06em" },
        ],
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
