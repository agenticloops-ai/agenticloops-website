import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: 'https://agenticloops-ai.github.io',
    base: '/agenticloops-website',
    integrations: [react(), tailwind()],
});
