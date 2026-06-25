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
        // Flat structure prevents utility collision bugs during Vercel builds
        primary: '#6366f1', // Indigo Base
        'primary-dark': '#4f46e5',
        'primary-light': '#818cf8',
        
        accent: '#06b6d4', // Teal/Cyan Base
        'accent-dark': '#0891b2',
        
        'bg-dark': '#020617', // Slate 950
        'bg-card': '#0b1120', // Slate 900
        
        'txt-main': '#f8fafc', // Slate 50
        'txt-muted': '#94a3b8', // Slate 400
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