import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium medical palette: soft white, clinical blue, luxury gold
        ivory: "#F8FAFC",
        porcelain: "#EEF3F8",
        clinical: {
          50: "#EBF4FB",
          100: "#D4E7F6",
          200: "#A9CFEC",
          300: "#7DB6E2",
          400: "#529ED8",
          500: "#2A86CE",
          600: "#1F6BA8",
          700: "#175082",
          800: "#0F365B",
          900: "#081D33",
        },
        gold: {
          100: "#FBF3DE",
          200: "#F4E2B0",
          300: "#EBCC79",
          400: "#DDB14A",
          500: "#C9972E",
          600: "#A87A22",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 54, 91, 0.12)",
        "glass-lg": "0 24px 64px rgba(15, 54, 91, 0.18)",
        gold: "0 8px 30px rgba(201, 151, 46, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        spinSlow: "spinSlow 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
