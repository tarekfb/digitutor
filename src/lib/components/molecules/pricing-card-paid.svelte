<script lang="ts">
  import { goto } from "$app/navigation";
  import SecondaryTitle from "../atoms/secondary-title.svelte";
  import { Button } from "../ui/button";
  import { Badge } from "$lib/components/ui/badge/index.js";

  export let plan;
</script>

<div class="generic-card w-11/12 border border-solid border-accent">
  <div class="flex flex-col gap-y-4">
    <div class="flex justify-between gap-x-2">
      <SecondaryTitle>{plan.name}</SecondaryTitle>
      <Badge variant="destructive">GRATIS JUST NU</Badge>
    </div>
    <div class="text-muted-foreground">
      <p>En plan som täcker alla dina behov.</p>
      <p>
        Gratis tills vidare - helt utan betalkort, avgifter eller testperiod.
      </p>
    </div>
    <div class="text-muted-foreground">
      Inkluderar
      <ul class="list-disc list-inside mt-2 space-y-1">
        {#each plan.features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
    </div>
    <div class="flex flex-col gap-y-4 mt-8">
      <div class="flex flex-col">
        <span class="text-3xl md:text-4xl font-bold line-through"
          >{plan.price} SEK</span
        >
        <div>
          <span
            class="text-3xl md:text-4xl font-bold text-destructive whitespace-nowrap"
            >0 SEK</span
          >
          <span class="text-muted-foreground ml-1 md:ml-2"
            >{plan.priceIntervalName}</span
          >
        </div>
      </div>
      <div class="flex justify-center gap-x-1">
        <Button
          class="w-4/5 md:w-2/5"
          on:click={() =>
            goto(
              "/account/subscribe/" + (plan?.stripe_price_id ?? "free_plan"),
            )}
        >
          Kom igång
        </Button>
      </div>
    </div>
  </div>
</div>
