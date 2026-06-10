import { OGImageRoute } from 'astro-og-canvas';

import type { OGImageOptions } from 'astro-og-canvas';

export const prerender = true;

const pages = import.meta.glob<{ og?: OGImageOptions }>(
  '/src/pages/**/*.astro',
  { eager: true },
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: Object.fromEntries(
    Object.entries(pages).filter(
      (entry): entry is [string, { og: OGImageOptions }] =>
        Boolean(entry[1].og),
    ),
  ),
  getImageOptions: (_, page) => ({ ...page.og }),
});
