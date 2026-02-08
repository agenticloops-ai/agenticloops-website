import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: process.env.SITE_URL || 'https://agenticloops-ai.github.io',
    base: process.env.BASE_PATH || '',
    integrations: [react(), tailwind()],
});
