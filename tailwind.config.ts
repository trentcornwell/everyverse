import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#ffffff", // base app background
          panel: "#f2f3f5", // sidebar / top bar
          elevated: "#ffffff", // cards (distinguished by border, not fill)
          border: "#e3e4e8",
        },
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          soft: "rgba(124, 58, 237, 0.12)",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
