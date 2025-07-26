import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        bgSecondary: "var(--color-bg-secondary)",
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        danger: "var(--color-danger)",
      },
    },
  },
  plugins: [],
};

export default config;
