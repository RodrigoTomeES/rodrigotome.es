import { OGImageRoute } from 'astro-og-canvas';

export const prerender = false;

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: import.meta.glob('/src/pages/**/*.astro', { eager: true }),
  getImageOptions: (_, page) => ({ ...page.og }),
});
