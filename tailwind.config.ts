import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        panel2: "var(--panel2)",
        line: "var(--line)",
        cyan: "var(--cyan)",
        blue: "var(--blue)",
        gold: "var(--gold)",
        green: "var(--green)",
        red: "var(--red)",
        white: "var(--white)",
        mute: "var(--mute)",
      },
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        grotesk: ["'Space Grotesk'", "sans-serif"],
      },
      maxWidth: {
        wrap: "1140px",
      },
    },
  },
  plugins: [],
};

export default config;
