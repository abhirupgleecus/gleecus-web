import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D7377",
        "primary-dark": "#085056",
        accent: "#14BDBD",
        danger: "#A32D2D",
        success: "#3B6D11",
        neutral: {
          50: "#F8FAFC",
          200: "#E2E8F0",
          600: "#4A5568",
          900: "#1E2A3A",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(30 42 58 / 0.08)",
        md: "0 6px 12px -2px rgb(30 42 58 / 0.14)",
      },
    },
  },
  plugins: [],
} satisfies Config;