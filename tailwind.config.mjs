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
  theme: {},
  plugins: [import('tailwind-scrollbar-hide')],
};
