import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hamzaalidev.vercel.app',
  output: 'static',

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],

  vite: {
    ssr: {
      noExternal: ['gsap', 'lenis'],
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  devToolbar: {
    enabled: false,
  },
});