/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E14",
        surface: "#12151F",
        "surface-2": "#181C2A",
        border: "#232A3B",
        muted: "#8891A5",
        ink: "#E4E7ED",
        flow: {
          DEFAULT: "#2DD4BF",
          dim: "#0E4F49",
        },
        interrupt: {
          DEFAULT: "#FB7185",
          dim: "#5C222C",
        },
        warn: {
          DEFAULT: "#F5B940",
          dim: "#5B4113",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
