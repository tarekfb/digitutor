import { sveltekit } from "@sveltejs/kit/vite";
import { sentrySvelteKit } from "@sentry/sveltekit";
import { defineConfig, loadEnv } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

const env = loadEnv(
  'all',
  process.cwd()
);

export default defineConfig({
  plugins: [
    sentrySvelteKit(
      {
        adapter: 'cloudflare',
        sourceMapsUploadOptions: {
          org: 'digitutor-dev',
          project: 'javascript-sveltekit',
          authToken: env.VITE_PRIVATE_SENTRY_AUTH_TOKEN,
        }
      }
    ),
    sveltekit(),
    enhancedImages(),
  ],
});