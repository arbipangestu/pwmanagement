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
          DEFAULT: "#d32f2f", // Japfa Red for buttons
          dark: "#b71c1c", // Darker red for hover
          accent: "#d32f2f", // Japfa Red for highlights/errors
        },
        secondary: {
          DEFAULT: "#171717", // Black for main text
          charcoal: "#424242", // Dark gray for secondary text
        },
        success: {
          DEFAULT: "#388e3c", // Japfa Green for success
        },
        form: {
          background: "#e8f5e9", // Light green for form background
          border: "#bdbdbd", // Gray for form border
        },
        highlight: {
          white: "#ffffff", // White for general background
        },
      },
    },
  },
  plugins: [],
};
export default config;
