import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          light: "#818CF8",
          dark: "#3730A3",
        },
        accent: {
          DEFAULT: "#9333EA",
          light: "#A855F7",
          dark: "#7E22CE",
        },
        dark: {
          DEFAULT: "#0F172A",
          lighter: "#1E293B",
          card: "#1E293B",
          border: "#334155",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #4F46E5, #9333EA)",
        "gradient-primary-hover": "linear-gradient(135deg, #4338CA, #7E22CE)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #4F46E5, 0 0 10px #4F46E5" },
          "100%": { boxShadow: "0 0 20px #9333EA, 0 0 40px #9333EA" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
