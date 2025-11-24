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
          DEFAULT: "#C70039", // Elegant Red
          hover: "#A0002D",
          light: "#FADBD8",
        },
        background: "#F8F9FA", // Light Grey for cleanliness
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
