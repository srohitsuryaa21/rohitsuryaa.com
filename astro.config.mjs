import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://rohitsuryaa.com',
  output: 'static',
  // The developer overlay otherwise sits directly on top of the chapter controls.
  devToolbar: { enabled: false },
});
