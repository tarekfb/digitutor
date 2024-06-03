<script lang="ts">
  import SecondaryTitle from "../atoms/secondary-title.svelte";
  import { Button } from "../ui/button";
  import { Badge } from "$lib/components/ui/badge/index.js";

  export let plan;
</script>

<div class="generic-card w-11/12 cursor-not-allowed background-gradient text-muted-foreground">
  <div class="flex flex-col gap-y-4">
    <SecondaryTitle>{plan.name}</SecondaryTitle>
    <div class="text-muted-foreground">
      <p>Ej tillgängligt då Pro är gratis.</p>
    </div>
    <div class="text-muted-foreground">
      Inkluderar
      <ul class="list-disc list-inside mt-2 space-y-1">
        {#each plan.features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
    </div>
    <div class="flex flex-col gap-y-4 mt-8 text-muted-foreground">
      <div>
        <span class="text-4xl font-bold">{plan.price} SEK</span>
        <span class="text-muted-foreground">{plan.priceIntervalName}</span>
      </div>
      <div class="flex justify-center gap-x-1">
        <Button variant="outline" disabled>Otillgänglig just nu</Button>
      </div>
    </div>
  </div>
</div>

<style>
  .background-gradient {
    background: linear-gradient(
      to top left,
      white,
      white 49.5%,
      rgb(226, 169, 169) 49.5%,
      rgb(226, 169, 169) 50.5%,
      white,
      50.5%,
      white
    );
  }
</style>
