<script>
  import "src/app.pcss";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { unknownErrorMessage } from "src/lib/constants";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
</script>

<div class="max-w-lg text-center flex flex-col items-center self-center m-8">
  <PrimaryTitle class="text-5xl md:text-6xl"
    >Det här va lite pinsamt...</PrimaryTitle
  >
  <p class="py-6 text-2xl">{unknownErrorMessage}</p>
  <Button on:click={() => goto("/")}>Gå hem</Button>
</div>

<!-- <p class="py-6 text-2xl">Något gick fel: {$page?.error?.message}</p> -->
