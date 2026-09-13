import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroc: {
          red: "#C8102E",
          redDark: "#8E0D20",
          green: "#006233",
          greenDark: "#004B27",
          cream: "#FAF8F3"
        }
      },
      boxShadow: {
        premium: "0 24px 70px rgba(0,0,0,.18)"
      }
    }
  },
  plugins: []
};
export default config;