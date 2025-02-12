<script lang="ts">
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import Button from "src/lib/components/ui/button/button.svelte";
  import {
    pricingPlans,
    websiteName,
  } from "src/lib/shared/constants/constants.ts";
  import * as Accordion from "src/lib/components/ui/accordion/index.js";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { costPerRequest } from "src/lib/shared/constants/constants.js";

  export let highlightedPlanId: string = "premium";
  export let currentPlanId: string = "";
</script>

<svelte:head>
  <title>{websiteName} | Premium</title>
</svelte:head>

<RootContainer maxWidth minWidth class="gap-y-6 self-center md:gap-y-10">
  <div class="flex flex-col items-center justify-center">
    <PrimaryTitle responsiveMb>Premium</PrimaryTitle>
    <p class="text-lg text-muted-foreground md:text-xl">
      Kontakta oändligt med lärare och få den bästa möjliga hjälpen. Endast 95
      SEK per månad. Avsluta prenumerationen när du vill.
    </p>
    <Button
      variant="third"
      on:click={() => goto("/account/subscription")}
      class="mt-2 md:mt-3">Skaffa Premium</Button
    >
  </div>

  <section
    class="flex flex-col-reverse flex-wrap place-content-center gap-6 md:gap-10 lg:flex-row"
  >
    {#each pricingPlans as pricingPlan}
      <PricingModule
        {currentPlanId}
        highlighted={pricingPlan.id === highlightedPlanId}
        {pricingPlan}
      />
    {/each}
  </section>

  <section class="flex w-full flex-col items-center">
    <SecondaryTitle responsiveMb>Vanliga frågor och svar</SecondaryTitle>
    <Accordion.Root class="*:border-testing w-full sm:max-w-[70%]">
      <Accordion.Item value="item-1">
        <Accordion.Trigger
          >När kan jag avbryta prenumerationen?</Accordion.Trigger
        >
        <Accordion.Content
          >När du vill. Du betalar bara nästkommande betalning och sedan avbryts
          prenumerationen.</Accordion.Content
        >
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger>Hur funkar krediter?</Accordion.Trigger>
        <Accordion.Content>
          Varje gång du skapar en kontakt med en lärare kostar det {costPerRequest}
          krediter. Om du redan har en konversation och chatt med läraren kostar
          meddelanden ingenting. Du kan se hur många krediter du har under
          <a href="/account/billing" class="link">betalningar</a>.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Hur går detta runt?</Accordion.Trigger>
        <Accordion.Content>
          Det gör det inte. Just nu är målet är att ge en så bra tjänst som
          möjligt, utan hänsyn till vinst. Vi vill låta så många som möjligt
          använda {websiteName} för att kunna förbättra innehållet och funktionerna.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </section>
  <section class="flex w-full flex-col items-center">
    <SecondaryTitle responsiveMb>Köp fler krediter</SecondaryTitle>
    <p>
      Under <a href="/account/billing" class="link">betalningar</a> kan du köpa fler
      krediter.
    </p>
    <Button
      variant="third"
      on:click={() => goto("/account/billing")}
      class="mt-2 md:mt-3">Köp krediter</Button
    >
  </section>
</RootContainer>
