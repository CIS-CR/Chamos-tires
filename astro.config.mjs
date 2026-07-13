// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://chamos-tires.pages.dev';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
});
