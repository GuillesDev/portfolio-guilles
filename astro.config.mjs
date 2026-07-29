// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://portfolio-guilles.vercel.app',
  output: 'hybrid',
  adapter: vercel(),
  // Overridable locally (e.g. when dist/ is held by another tool's sandbox)
  outDir: process.env.ASTRO_OUT_DIR || './dist',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
