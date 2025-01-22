<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import {
    defaultPlanId,
    pricingPlans,
    websiteName,
  } from "src/lib/shared/constants/constants";
  import Button from "src/lib/components/ui/button/button.svelte";
  import { Pencil } from "lucide-svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";

  export let data: PageData;
  $: ({ isActiveCustomer, hasEverHadSubscription } = data);
  let currentPlanId = data.currentPlanId ?? defaultPlanId;
  let currentPlanName = pricingPlans.find(
    (pricingPlan) => pricingPlan.id === data.currentPlanId,
  )?.name;
</script>

<svelte:head>
  <title>{websiteName} | Betalning</title>
</svelte:head>

<RootContainer maxWidth minWidth class="gap-y-6 self-center md:gap-y-8">
  <section class="flex flex-col items-center justify-center gap-y-2 md:gap-y-4">
    <PrimaryTitle responsiveMb>Betalning</PrimaryTitle>
    <div class="self-start text-muted-foreground">
      <p>
        Här finns din betalningsinformation och betalningshistorik. Se vår <a
          href="/pricing"
          target="_blank"
          class="underline">prissida</a
        >
        för mer information om prenumerationer.
      </p>
    </div>
  </section>
  <section
    class="flex w-full flex-col items-center justify-center gap-y-2 md:gap-y-4"
  >
    {#if !data.isActiveCustomer}
      <PrimaryTitle responsiveMb>Välj en plan</PrimaryTitle>
    {/if}

    {#if !data.isActiveCustomer}
      <div
        class="flex flex-col-reverse flex-wrap place-content-center gap-6 md:gap-10 lg:flex-row"
      >
        {#each pricingPlans as pricingPlan}
          <PricingModule {currentPlanId} {pricingPlan} />
        {/each}
      </div>

      {#if data.hasEverHadSubscription}
        <div>
          <a href="/account/billing/manage" class="link"
            >Se tidigare betalningar</a
          >
        </div>
      {/if}
    {:else}
      <div class="flex flex-col gap-y-2 self-center md:gap-y-4 md:self-start">
        <SecondaryTitle>Din nuvarande plan:</SecondaryTitle>
        <div class="flex items-center gap-x-2">
          <div
            class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1.5 font-mono text-sm font-normal uppercase tracking-wider md:p-2"
          >
            {currentPlanName}
          </div>
          <Button
            href="/account/billing/manage"
            class="flex gap-x-2 self-center md:max-w-widest"
            variant="outline"><Pencil class="size-4" />Hantera</Button
          >
        </div>
      </div>
    {/if}
  </section>
</RootContainer>
