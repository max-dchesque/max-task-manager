import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Wonder Games Neon Palette */
        neon: {
          50: "#F7FEE8",
          100: "#EDFD9C",
          200: "#E0F870",
          300: "#D2F343",
          400: "#D4FB08", // Primary
          500: "#BAE200", // Hover
          600: "#96B800",
          700: "#7A9400",
          800: "#5E7000",
          900: "#425800",
          950: "#253300", // Text on neon
        },

        /* Neutral Palette */
        black: "#000000",
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },

        /* Status Colors */
        status: {
          online: "#22C55E",
          offline: "#6B7280",
          busy: "#EF4444",
          idle: "#F59E0B",
        },

        /* Task Status Colors */
        task: {
          pending: "#F59E0B",
          "in-progress": "#3B82F6",
          done: "#22C55E",
          blocked: "#EF4444",
        },

        /* Priority Colors */
        priority: {
          alta: "#EF4444",
          media: "#F59E0B",
          baixa: "#22C55E",
        },

        /* Agent Colors (Custom) */
        agent: {
          max: "#8B5CF6",    // Purple
          neo: "#3B82F6",    // Blue
          ine: "#EC4899",    // Pink
          satoshi: "#F59E0B", // Yellow
          strider: "#06B6D4", // Cyan
        },
      },

      borderRadius: {
        "4xl": "24px",
        "5xl": "32px",
      },

      fontSize: {
        "display-xs": ["48px", { lineHeight: "48px", letterSpacing: "-2px" }],
        "display-sm": ["64px", { lineHeight: "75.52px", letterSpacing: "-2.56px" }],
        display: ["80px", { lineHeight: "83.2px", letterSpacing: "-3px" }],
        "display-lg": ["100px", { lineHeight: "90px", letterSpacing: "-4px" }],
        "display-xl": ["138.69px", { lineHeight: "138.69px", letterSpacing: "-6.5px" }],
        "display-2xl": ["200px", { lineHeight: "200px", letterSpacing: "-8px" }],
        "display-3xl": ["300px", { lineHeight: "300px", letterSpacing: "-12px" }],
      },

      boxShadow: {
        "neon": "0 0 4px rgb(212, 251, 8)",
        "neon-lg": "0 0 12px rgb(212, 251, 8), 0 0 20px rgb(186, 226, 0)",
        "glass": "inset 0 1px 3px 0 rgba(255, 255, 255, 0.05), inset -1px -1px 3px 0 rgba(0, 0, 0, 0.1), inset -1px -1px 0 0 rgba(0, 0, 0, 0.2)",
        "card": "0 1px 1px 0 rgba(255, 255, 255, 0.2), 0 1px 1px 0 inset rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.3)",
        "inner-glow": "inset 0 0 20px 5px rgba(165, 167, 171, 0.2)",
      },

      spacing: {
        "18": "4.5rem", /* 72px */
        "20": "5rem", /* 80px */
        "22": "5.5rem", /* 88px */
        "24": "6rem", /* 96px */
        "128": "32rem", /* 512px */
      },
    },
    animationDuration: {
      "2000": "2s",
      "3000": "3s",
      "4000": "4s",
      "5000": "5s",
    },
    animationTimingFunction: {
      "smooth": "cubic-bezier(0.3, 0, 0.04, 1)",
      "snappy": "cubic-bezier(0.2, 0.8, 0.4, 1)",
      "sharp": "cubic-bezier(0.77, 0, 0.175, 1)",
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
