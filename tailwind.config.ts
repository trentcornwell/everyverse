import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#3a3c3f", // primary text — warm charcoal, not pure black
        canvas: {
          DEFAULT: "#ffffff", // base app background
          panel: "#f5f5f5", // header / secondary sections
          elevated: "#ffffff", // cards (distinguished by border, not fill)
          border: "#dcdcdc",
        },
        accent: {
          DEFAULT: "#7a1116",
          hover: "#5c0d10",
          soft: "rgba(122, 17, 22, 0.1)",
        },
        gold: {
          DEFAULT: "#caa63d",
          hover: "#b3902f",
          soft: "rgba(202, 166, 61, 0.12)",
        },
      },
      fontFamily: {
        serif: ["var(--font-merriweather)", "Georgia", "Times New Roman", "serif"],
        display: ["var(--font-oswald)", "Impact", "Arial Narrow", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
