<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import Error from "$lib/components/organisms/error.svelte";
  import { page } from "$app/stores";

  const title =
    $page.error?.message === "Internal error"
      ? undefined
      : $page.error?.message;
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

<Error {title} code={$page.status} />
