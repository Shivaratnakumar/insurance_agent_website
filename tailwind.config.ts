import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#071936", 900: "#0B2450", 800: "#123B78", 700: "#174C91" },
        gold: { 300: "#F7D98A", 400: "#EFC15D", 500: "#DFA52D" },
      },
      boxShadow: { soft: "0 20px 60px rgba(7,25,54,.10)" },
      fontFamily: { sans: ["Arial", "Noto Sans Kannada", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
