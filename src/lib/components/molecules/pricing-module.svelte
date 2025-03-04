<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    PricingPlanIds,
    type PricingPlan,
  } from "src/lib/shared/models/subscription.ts";
  import Button from "src/lib/components/ui/button/button.svelte";

  export let pricingPlan: PricingPlan;
  export let highlighted: boolean = false;
  export let currentPlanId: string = "";
</script>

<div
  class="flex-none rounded-xl border border-solid bg-card {highlighted
    ? 'border-third'
    : 'border-gray-200'} min-w-[260px] max-w-[310px] flex-1 flex-grow p-6 shadow-xl"
>
  <div class="flex h-full flex-col">
    <div class="text-xl font-bold">{pricingPlan.name}</div>
    <p class="mt-2 text-sm leading-relaxed text-gray-500">
      {pricingPlan.description}
    </p>
    {#if pricingPlan.bold}
      <p class="mt-2 text-sm font-bold leading-relaxed text-gray-500">
        {pricingPlan.bold}
      </p>
    {/if}
    <div class="mt-auto pt-4 text-sm text-gray-600">
      Planen inkluderar:
      <ul class="mt-2 list-inside list-disc space-y-1">
        {#each pricingPlan.features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
    </div>
    <div class="pt-8">
      <span class="text-4xl font-bold">{pricingPlan.price}</span>
      <span class="text-gray-400">{pricingPlan.priceIntervalName}</span>
      <div class="mt-6 flex flex-1 flex-row items-center pt-4">
        {#if pricingPlan.id === currentPlanId}
          <div
            class="self-start whitespace-nowrap rounded-sm border border-solid border-third bg-background p-1.5 font-mono text-sm font-normal tracking-wider md:p-2"
          >
            Nuvarande plan
          </div>
        {:else}
          <Button
            on:click={() =>
              goto(
                pricingPlan.id === PricingPlanIds.Free
                  ? "/account/billing?plan=free"
                  : `/account/subscribe/${pricingPlan.stripePriceId}`,
              )}>Kom igång</Button
          >
        {/if}
      </div>
    </div>
  </div>
</div>
