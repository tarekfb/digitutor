import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
// import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
  plugins: [sentrySvelteKit({
    sourceMapsUploadOptions: {
      org: "digitutor-dev",
      project: "javascript-sveltekit"
    }
  }), // svelteInspector({
  //   /* plugin options */
  // })
  sveltekit()],
});