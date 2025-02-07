<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types.ts";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { PricingPlanIds } from "src/lib/shared/models/subscription.ts";
  import {
    defaultPlanId,
    pricingPlans,
    websiteName,
  } from "src/lib/shared/constants/constants.ts";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";
  import Button from "src/lib/components/ui/button/button.svelte";
  import Pencil from "lucide-svelte/icons/pencil";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import CreditsNav from "src/lib/components/molecules/credits-nav.svelte";
  import {
    creditProducts,
    defaultErrorDescription,
  } from "src/lib/shared/constants/constants.js";
  import { enhance } from "$app/forms";
  import AlertMessage from "src/lib/components/atoms/alert-message.svelte";
  import { goto } from "$app/navigation";

  export let data: PageData;
  $: ({ hasEverHadSubscription, balance } = data);
  let currentPlanId = data.currentPlanId ?? defaultPlanId;
  let currentPlanName = pricingPlans.find(
    (pricingPlan) => pricingPlan.id === currentPlanId,
  )?.name;

  const pricingPlan = pricingPlans.find(
    (plan) => plan.id === PricingPlanIds.Premium,
  );
</script>

<svelte:head>
  <title>{websiteName} | Betalningar</title>
</svelte:head>

<RootContainer maxWidth minWidth class="gap-y-6 self-center md:gap-y-8">
  <section class="flex flex-col items-center justify-center gap-y-2 md:gap-y-4">
    <PrimaryTitle responsiveMb>Betalningar</PrimaryTitle>
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
    {#if currentPlanId !== PricingPlanIds.Premium}
      {#if pricingPlan}
        <SecondaryTitle responsiveMb>Skaffa premium</SecondaryTitle>
        <PricingModule {currentPlanId} {pricingPlan} />
      {:else}
        <!-- this if case should never happen, just checking edge case -->
        <Button
          variant="third"
          on:click={() => goto("/account/subscription.ts")}
          >Skaffa Premium</Button
        >
      {/if}
      <div
        class="flex w-full flex-col gap-y-2 self-center md:gap-y-4 md:self-start"
      >
        <div class="flex items-center gap-x-2 self-center md:self-start">
          <SecondaryTitle>Dina krediter:</SecondaryTitle>
          <div
            class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1 font-mono text-sm font-normal uppercase tracking-wider md:p-2"
          >
            {balance === undefined ? "?" : balance}
          </div>
        </div>
        {#if balance === undefined}
          <AlertMessage
            class="w-3/4 self-center"
            title="Kunde inte hämta dina krediter"
            description={defaultErrorDescription}
            variant="destructive"
          />
        {/if}
        <div class="flex items-center gap-x-2 self-center md:self-start">
          <SecondaryTitle>Köp fler krediter</SecondaryTitle>
        </div>
        <ul
          class="h-38 mt-4 flex flex-wrap justify-center gap-4 self-center md:mt-6 md:h-44 md:w-full md:flex-row md:self-start"
        >
          {#each creditProducts as creditsProduct}
            <CreditsNav {creditsProduct} />
          {/each}
        </ul>
      </div>
    {/if}
    <div
      class="flex w-full flex-col gap-y-2 self-center md:gap-y-4 md:self-start"
    >
      <div class="flex items-center gap-x-2 self-center md:self-start">
        <SecondaryTitle>Din nuvarande plan:</SecondaryTitle>
        <div
          class="self-start whitespace-nowrap rounded-sm border border-accent bg-card p-1 font-mono text-sm font-normal uppercase tracking-wider md:p-2"
        >
          {currentPlanName}
        </div>
      </div>
      <div class="flex items-center gap-x-2">
        <Button
          href="/account/billing/manage"
          class="flex w-full gap-x-2 self-center md:max-w-widest"
          variant="outline-card"><Pencil class="size-4" />Hantera</Button
        >
      </div>
    </div>
    {#if hasEverHadSubscription}
      <div>
        <a href="/account/billing/manage" class="link"
          >Se tidigare betalningar</a
        >
      </div>
    {/if}
  </section>
  <form action="?/add-credits" method="post" use:enhance>
    <Button
      type="submit"
      class="flex w-full gap-x-2 self-center md:max-w-widest"
      variant="outline-card">add credits</Button
    >
  </form>
  <form action="?/remove-credits" method="post" use:enhance>
    <Button
      type="submit"
      class="flex w-full gap-x-2 self-center md:max-w-widest"
      variant="outline-card">remove credits</Button
    >
  </form>
</RootContainer>
