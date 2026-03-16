import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://hamzaali-dev.vercel.app',
  output: 'static',

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
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
});