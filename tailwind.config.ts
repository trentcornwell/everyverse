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
          DEFAULT: "#c6000e",
          hover: "#a5000c",
          soft: "rgba(198, 0, 14, 0.1)",
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
