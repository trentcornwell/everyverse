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
          DEFAULT: "#0f172a", // base app background
          panel: "#161f36", // sidebar / top bar
          elevated: "#1c273f", // cards
          border: "#28324a",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
          soft: "rgba(139, 92, 246, 0.14)",
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
