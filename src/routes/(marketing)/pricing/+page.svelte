<script lang="ts">
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import Container from "src/lib/components/templates/container.svelte";
  import Button from "src/lib/components/ui/button/button.svelte";
  import {
    premiumPlan,
    pricingPlans,
    websiteName,
  } from "src/lib/shared/constants/constants.ts";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";
  import ArrowRightIcon from "lucide-svelte/icons/arrow-right";
  import Faq from "src/lib/components/molecules/faq.svelte";

  export let currentPlanId: string = "";
  const maxWidth = "max-w-full md:max-w-screen-sm lg:max-w-screen-md";
  const containerStyling = `px-4 md:px-8 max-w-full ${maxWidth}`;
</script>

<svelte:head>
  <title>{websiteName} | Premium</title>
</svelte:head>

<Container
  class="w-full gap-y-6 self-center py-4 md:gap-y-10 md:py-8"
  margin={false}
>
  <div class="flex flex-col items-center justify-center {containerStyling}">
    <PrimaryTitle responsiveMb>Premium</PrimaryTitle>
    <p class="text-lg text-muted-foreground md:text-xl">
      Kontakta oändligt med lärare och få den bästa möjliga hjälpen. Endast 95
      SEK per månad. Avsluta prenumerationen när du vill.
    </p>
    <Button
      variant="third"
      on:click={() => goto(`/account/subscribe/${premiumPlan.stripePriceId}`)}
      class="mt-2 flex w-full items-center gap-x-2 md:mt-3 md:w-auto md:min-w-widest "
    >
      Skaffa Premium
      <ArrowRightIcon class="size-button-icon" />
    </Button>
  </div>

  <section
    class="flex w-full flex-col-reverse flex-wrap place-content-center gap-6 md:gap-10 lg:flex-row {containerStyling}"
  >
    {#each pricingPlans as pricingPlan}
      <PricingModule
        {currentPlanId}
        highlighted={pricingPlan.id === premiumPlan.id}
        {pricingPlan}
      />
    {/each}
  </section>

  <section class="mt-2 flex w-full flex-col items-center">
    <PrimaryTitle
      id="faq"
      class="w-full bg-secondary p-4 text-center text-background md:p-8"
      responsiveMb
    >
      Vanliga frågor och svar
    </PrimaryTitle>
    <Faq class={containerStyling} />
  </section>
</Container>
