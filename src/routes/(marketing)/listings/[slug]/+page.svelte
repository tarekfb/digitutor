<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { Trash2 } from "lucide-svelte";
  export let data;
  const listing = data.listing;
</script>

<div class="p-8 space-y-2">
  {#if !listing}
    <h1 class="text-3xl">Ojdå... Här var det tomt</h1>
    <h1 class="text-xl">
      Den här annonsen finns inte längre. Vill du gå hem istället?
    </h1>

    <Button on:click={() => goto("/")}>Gå hem</Button>
  {:else}
    <div class="flex justify-between items-center">
      <h1 class="text-3xl">{listing.title}</h1>
      <Button on:click={() => goto("/")} aria-label="Delete listing">
        <Trash2 />
      </Button>
    </div>
    <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
  {/if}
</div>
