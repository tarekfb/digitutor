import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { enhancedImages } from '@sveltejs/enhanced-img';
// import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';

export default defineConfig({
  plugins: [
    sveltekit(),
		enhancedImages(),

    // svelteInspector({
    //   /* plugin options */
    // })
  ],
  ssr: {
    noExternal: ['@jill64/sentry-sveltekit-cloudflare']
  }
});