<script>
  import "src/app.pcss";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import { page } from "$app/stores";
  import { unknownErrorMessage } from "src/lib/constants";
</script>

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
