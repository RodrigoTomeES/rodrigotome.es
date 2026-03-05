import { screens } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  experimental: {
    optimizeUniversalDefaults: true,
  },
  screens: {
    /*
     * Adding smaller breakpoints
     * @see https://tailwindcss.com/docs/screens#adding-smaller-breakpoints
     */
    xs: '360px',
    screens,
    '2xl': '1440px',
  },
  theme: {
    extend: {
      colors: {
        'cv-bg': '#f2f2f2',
        'cv-border': '#dddddd',
        'cv-muted': '#666666',
        'brand-green': '#00bc2f',
      },
      boxShadow: {
        cv: '0 1px 2px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [import('tailwind-scrollbar-hide')],
};
