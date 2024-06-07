<script>
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import "src/app.pcss";
  import { websiteName } from "src/lib/constants";

  export let data;
</script>

<Navbar profile={data.profile} />

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
      <a class="link link-hover" href="/contact_us">Contact Us</a>
    </nav>
  </footer>
</div>
