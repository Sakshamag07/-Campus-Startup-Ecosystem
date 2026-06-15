import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo
          dark: '#4f46e5',
          light: '#818cf8',
        },
        accent: {
          DEFAULT: '#06b6d4', // Teal/Cyan
          dark: '#0891b2',
        },
        background: {
          dark: '#020617', // Slate 950
          card: '#0b1120', // Slate 900
        },
        text: {
          main: '#f8fafc', // Slate 50
          muted: '#94a3b8', // Slate 400
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: '24px',
        md: '16px',
        sm: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
