<script lang="ts">
  import Navbar from "$lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { websiteName } from "$lib/shared/constants/constants";
  import type { PageData } from "./$types";
  import { logout } from "src/lib/utils";

  export let data: PageData;
  $: ({ supabase, session, profile } = data);
</script>

<Navbar {profile} logout={() => logout(supabase, session)} />

<div class="flex flex-col items-center m-8 gap-y-4">
  <slot />
</div>

<!-- Spacer grows so the footer can be at bottom on short pages -->
<div class="flex-grow"></div>
<div class="bg-">
  <div class="border-t max-w-[1000px] mx-auto"></div>
  <footer class="flex justify-between py-10 px-16">
    <a href="/" class="self-center">
      <h1 class="text-3xl md:text-4xl">{websiteName}</h1>
    </a>
    <nav class="flex flex-col space-y-1">
      <span class="font-semibold uppercase">Explore</span>
      <a class="link link-hover" href="/">Overview</a>
      <a class="link link-hover" href="/contact-us">Kontakta oss</a>
    </nav>
  </footer>
</div>
