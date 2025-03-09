<script lang="ts">
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import Container from "src/lib/components/templates/container.svelte";
  import Button from "src/lib/components/ui/button/button.svelte";
  import {
    freeCredits,
    premiumPlan,
    pricingPlans,
    websiteName,
  } from "src/lib/shared/constants/constants.ts";
  import * as Accordion from "src/lib/components/ui/accordion/index.js";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { costPerRequest } from "src/lib/shared/constants/constants.js";
  import ArrowRightIcon from "lucide-svelte/icons/arrow-right";
  import Link from "src/lib/components/atoms/link.svelte";

  export let currentPlanId: string = "";
</script>

<svelte:head>
  <title>{websiteName} | Premium</title>
</svelte:head>

<Container maxWidth minWidth class="gap-y-6 self-center md:gap-y-10" padding>
  <div class="flex flex-col items-center justify-center">
    <PrimaryTitle responsiveMb>Premium</PrimaryTitle>
    <p class="text-lg text-muted-foreground md:text-xl">
      Kontakta oändligt med lärare och få den bästa möjliga hjälpen. Endast 95
      SEK per månad. Avsluta prenumerationen när du vill.
    </p>
    <Button
      variant="third"
      on:click={() => goto(`/account/subscribe/${premiumPlan.stripePriceId}`)}
      class="mt-2 flex w-full items-center gap-x-2 md:mt-3 md:w-auto md:min-w-widest"
    >
      Skaffa Premium
      <ArrowRightIcon class="size-button-icon" />
    </Button>
  </div>

  <section
    class="flex w-full flex-col-reverse flex-wrap place-content-center gap-6 md:gap-10 lg:flex-row"
  >
    {#each pricingPlans as pricingPlan}
      <PricingModule
        {currentPlanId}
        highlighted={pricingPlan.id === premiumPlan.id}
        {pricingPlan}
      />
    {/each}
  </section>

  <section class="flex w-full flex-col items-center">
    <SecondaryTitle responsiveMb>Vanliga frågor och svar</SecondaryTitle>
    <Accordion.Root class="w-full sm:max-w-[70%]">
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
        <Accordion.Trigger
          >Hur funkar gratis kontaktförfrågningar?</Accordion.Trigger
        >
        <Accordion.Content>
          När du registrerar dig får du automatiskt {freeCredits} gratis kontaktförfrågningar.
          När du sedan kontaktar en lärare förbrukas en av dessa. Om du redan har
          en konversation och chatt med en lärare kan du såklart skicka hur många
          meddelanden du vill till denna lärare. Du kan se hur många återstående
          kontaktförfrågningar du har under
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
      <Accordion.Item value="item-4">
        <Accordion.Trigger
          >Vad händer när jag får slut på gratis kontaktannonser?</Accordion.Trigger
        >
        <Accordion.Content>
          Förhoppningsvis räcker de {freeCredits} stycken du fick när du skapade
          ett konto gott och väl för att hitta en bra lärare för dig. Om du mot förmodan
          får slut på alla {freeCredits} gratis kontaktförfrågningar kan du prenumera
          på {premiumPlan.name} för {premiumPlan.price}
          {premiumPlan.priceIntervalName} och kontakta oändligt med lärare.
          <br />
          <br />Tycker du att dessa {freeCredits} inte räcker till är du välkommen
          att <Link href="/contact-us">kontakta oss</Link>.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </section>
</Container>
