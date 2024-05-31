<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "../ui/button";

  export let highlightedPlanId: string = "";
  export let callToAction: string;
  export let currentPlanId: string = "";
  export let plan;
</script>

<div
  class="flex-none card generic-card {plan.id === highlightedPlanId
    ? 'border-primary'
    : 'border-gray-200'} shadow-xl flex-1 flex-grow min-w-[260px] max-w-[310px] p-6"
>
  <div class="flex flex-col h-full">
    <div class="text-xl font-bold">{plan.name}</div>
    <p class="mt-2 text-sm leading-relaxed">
      {plan.description}
    </p>
    <div class="mt-auto pt-4 text-sm">
      Inkluderar
      <ul class="list-disc list-inside mt-2 space-y-1">
        {#each plan.features as feature}
          <li class="">{feature}</li>
        {/each}
        <ul></ul>
      </ul>
    </div>
    <div class="pt-8">
      <span class="text-4xl font-bold">{plan.price}</span>
      <span class="text-muted-foreground">{plan.priceIntervalName}</span>
      <div class="mt-6 pt-4 flex-1 flex flex-row items-center">
        {#if plan.id === currentPlanId}
          <div
            class="btn btn-outline btn-success no-animation w-[80%] mx-auto cursor-default"
          >
            Nuvarande plan
          </div>
        {:else}
          <Button
            on:click={() =>
              goto(
                "/account/subscribe/" + (plan?.stripe_price_id ?? "free_plan"),
              )}
          >
            {callToAction}
          </Button>
          <!-- <a
                href={"/account/subscribe/" +
                  (plan?.stripe_price_id ?? "free_plan")}
                class="btn btn-primary w-[80%] mx-auto"
              >
              </a> -->
        {/if}
      </div>
    </div>
  </div>
</div>
