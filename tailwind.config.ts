import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bronze: {
          50: '#faf7f5',
          100: '#f5ede7',
          200: '#e8d6c7',
          300: '#d4b39a',
          400: '#c49574',
          500: '#a67856',
          600: '#8b6347',
          700: '#73513b',
          800: '#5f4432',
          900: '#4f392a',
        },
        cream: '#f5ede7',
        charcoal: '#2a2a2a',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};

export default config;
