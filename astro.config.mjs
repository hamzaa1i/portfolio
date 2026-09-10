import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical host. Controlled from one place so a future domain move
// (e.g. hamzaalikhurram.com) is a single config change.
const SITE_URL = process.env.SITE_URL ?? 'https://hamzaalidev.vercel.app';

export default defineConfig({
  site: SITE_URL,
  output: 'static',

  integrations: [
    mdx(),
    sitemap(),
  ],

  adapter: vercel({ imagemodel: false }),

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  devToolbar: {
    enabled: false,
  },
});
