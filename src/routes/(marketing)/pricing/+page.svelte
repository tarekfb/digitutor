<script lang="ts">
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import Button from "src/lib/components/ui/button/button.svelte";
  import {
    pricingPlans,
    websiteName,
  } from "src/lib/shared/constants/constants";
  import * as Accordion from "src/lib/components/ui/accordion";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";

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
      class="mt-2 md:mt-4"
      on:click={() => goto("/account/subscription")}>Skaffa Premium</Button
    >
  </div>

  <section class="flex w-full flex-col items-center">
    <PrimaryTitle responsiveMb>Vanliga frågor och svar</PrimaryTitle>
    <Accordion.Root class="w-full sm:max-w-[70%] *:border-testing">
      <Accordion.Item value="item-1" >
        <Accordion.Trigger 
          >När kan jag avbryta prenumerationen?</Accordion.Trigger
        >
        <Accordion.Content
          >När du vill. Du betalar bara nästkommande betalning och sen avbryts
          prenumerationen.</Accordion.Content
        >
      </Accordion.Item>
      <Accordion.Item value="item-2" >
        <Accordion.Trigger
          >Vad innebär max en konversation, för gratisplanen?</Accordion.Trigger
        >
        <Accordion.Content>
          Du får kontakta hur många lärare du vill, men du får endast ha en
          konversation med en lärare. Detta betyder att när en lärare accepterar
          din förfrågan har du använt din gratiskonversation. För premium kan du
          ha oändligt antal konversationer.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger>Hur går detta runt?</Accordion.Trigger>
        <Accordion.Content>
          Det gör det inte. Just nu är målet är att ge en så bra tjänst som
          möjligt. Därför vill vi låta så många som möjligt använda plattformen
          och sedan förbättra innehåller och funktionerna.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </section>

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
</RootContainer>
