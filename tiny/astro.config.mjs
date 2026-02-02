import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/tiny',
  adapter: node({
    mode: 'standalone',
  }),
  devToolbar: { enabled: false },
  integrations: [
    react()
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});