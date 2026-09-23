/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./app/**/*.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Sora", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        slate: {
          400: "#cbd5e1", // Remap to slate-300 for high-contrast (>8:1) against #0a0e17 dark theme
          500: "#94a3b8", // Remap to slate-400 for secondary text
        },
        surface: {
          base: "#0a0e17",
          card: "#131b2e",
          raised: "#1a243d",
        },
        status: {
          critical: "#ef4444",
          warning: "#f59e0b",
          nominal: "#10b981",
          offline: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
