import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
// import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
  plugins: [
    sentrySvelteKit(
      //   {
      //   sourceMapsUploadOptions: {
      //     org: 'my-org-slug',
      //     project: 'my-project-slug',
      //     authToken: process.env.SENTRY_AUTH_TOKEN,
      //   }
      // }
    ),
    sveltekit(),
    // svelteInspector({
    //   /* plugin options */
    // })
  ],
});