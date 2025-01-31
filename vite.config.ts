import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
// import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
  plugins: [
    sveltekit(),
    // svelteInspector({
    //   /* plugin options */
    // })
  ],
  ssr: {
    noExternal: ['@jill64/sentry-sveltekit-cloudflare']
  }
});