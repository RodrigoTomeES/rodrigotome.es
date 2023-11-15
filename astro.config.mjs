import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rodrigotome.es/',
  output: 'hybrid',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  image: {
    domains: ['flickr.com'],
  },
});
