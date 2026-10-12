import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://hamzaalikhurram.com',
  output: 'static',
  adapter: vercel(),

  integrations: [
    react(),
    sitemap(),
  ],

  vite: {
    css: { postcss: { plugins: [tailwind(), autoprefixer()] } },
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
