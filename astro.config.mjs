import { defineConfig } from 'astro/config';

// https://astro.build/config
// Static output, zero client JS by default — very lightweight.
// Custom domain (hydrosyng.com.ng) lives at the site root, so no `base` needed.
export default defineConfig({
  site: 'https://hydrosyng.com.ng',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    format: 'directory'
  }
});
