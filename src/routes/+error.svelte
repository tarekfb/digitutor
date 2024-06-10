<script>
  import "src/app.pcss";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import { page } from "$app/stores";
  import { unknownErrorMessage, websiteName } from "src/lib/constants";
</script>

<!-- todo: make component -->
<header
  class="sticky top-0 z-40 w-full bg-gradient-to-r from-primary to-accent text-background px-1"
>
  <div
    class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0"
  >
    <a href="/" class="text-2xl font-semibold">
      {websiteName}
    </a>
  </div>
</header>
<div
  class="max-w-lg text-center flex flex-col items-center gap-y-6 self-center m-8"
>
  <PrimaryTitle class="text-5xl md:text-6xl"
    >Det här va lite pinsamt...</PrimaryTitle
  >
  <p class="text-2xl md:text-3xl">
    {$page?.error?.message || unknownErrorMessage}
  </p>
  <Button on:click={() => goto("/")}>Gå hem</Button>
</div>
