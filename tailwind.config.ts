import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D32F2F", // Red
          hover: "#B71C1C",   // Darker Red
          light: "#FFCDD2",   // Light Red for accents if needed
        },
        background: "#FAFAFA", // Very light gray
        surface: "#FFFFFF",
        gray: {
            soft: "#F5F5F5",
        }
      },
    },
  },
  plugins: [],
};
export default config;
