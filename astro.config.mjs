import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rodrigotome.es/',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  adapter: cloudflare({
    imageService: 'compile',
  }),
  image: {
    domains: ['live.staticflickr.com'],
  },
  vite: {
    ssr: {
      // canvaskit-wasm relies on __dirname, which breaks when bundled as ESM
      // in the Cloudflare worker used for prerendering OG images
      external: ['canvaskit-wasm'],
    },
  },
});
