import { sveltekit } from "@sveltejs/kit/vite";
import { sentrySvelteKit } from "@sentry/sveltekit";
import { defineConfig, loadEnv } from 'vite';
// import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

const env = loadEnv(
  'all',
  process.cwd()
);

export default defineConfig({
  plugins: [
    sentrySvelteKit(
      {
        sourceMapsUploadOptions: {
          org: 'digitutor-dev',
          project: 'javascript-sveltekit',
          authToken: env.VITE_PRIVATE_SENTRY_AUTH_TOKEN,
        }
      }
    ),
    sveltekit(),
    // svelteInspector({
    //   /* plugin options */
    // })
  ],
});