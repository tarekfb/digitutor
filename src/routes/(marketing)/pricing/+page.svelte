<script lang="ts">
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import Button from "src/lib/components/ui/button/button.svelte";
  import {
    subsriptionPlans,
    websiteName,
  } from "src/lib/shared/constants/constants";
  import * as Accordion from "src/lib/components/ui/accordion";

  export let highlightedPlanId: string = "premium";
  export let callToAction: string = "Kom igång";
  export let currentPlanId: string = "";
  export let center = true;

  type PlanFeatureRow = {
    name: string;
    freeIncluded?: boolean;
    proIncluded?: boolean;
    freeString?: string;
    proString?: string;
    header?: boolean;
  };
  const planFeatures: PlanFeatureRow[] = [
    {
      name: "Section 1",
      header: true,
    },
    {
      name: "Feature 1",
      freeIncluded: true,
      proIncluded: true,
    },
    {
      name: "Feature 2",
      freeIncluded: false,
      proIncluded: true,
    },
    {
      name: "Feature 3",
      freeString: "3",
      proString: "Unlimited",
    },
    {
      name: "Section 2",
      header: true,
    },
    {
      name: "Feature 4",
      freeIncluded: true,
      proIncluded: true,
    },
    {
      name: "Feature 5",
      freeIncluded: false,
      proIncluded: true,
    },
  ];
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
    <Accordion.Root class="w-full sm:max-w-[70%]">
      <Accordion.Item value="item-1">
        <Accordion.Trigger
          >När kan jag avbryta prenumerationen?</Accordion.Trigger
        >
        <Accordion.Content
          >När du vill. Du betalar bara nästkommande betalning och sen avbryts
          prenumerationen.</Accordion.Content
        >
      </Accordion.Item>
      <Accordion.Item value="item-2">
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
          möjligt. Därför vill vi vi låta så många som möjligt använda
          plattformen och sedan förbättra tjänsten.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </section>

  <section
    class="flex flex-col gap-10 lg:flex-row {center
      ? 'place-content-center'
      : ''} flex-wrap"
  >
    {#each subsriptionPlans as plan}
      <div
        class="flex-none rounded-xl border border-solid bg-card {plan.id ===
        highlightedPlanId
          ? 'border-primary'
          : 'border-gray-200'} min-w-[260px] max-w-[310px] flex-1 flex-grow p-6 shadow-xl"
      >
        <div class="flex h-full flex-col">
          <div class="text-xl font-bold">{plan.name}</div>
          <p class="mt-2 text-sm leading-relaxed text-gray-500">
            {plan.description}
          </p>
          <div class="mt-auto pt-4 text-sm text-gray-600">
            Planen inkluderar:
            <ul class="mt-2 list-inside list-disc space-y-1">
              {#each plan.features as feature}
                <li class="">{feature}</li>
              {/each}
              <ul></ul>
            </ul>
          </div>
          <div class="pt-8">
            <span class="text-4xl font-bold">{plan.price}</span>
            <span class="text-gray-400">{plan.priceIntervalName}</span>
            <div class="mt-6 flex flex-1 flex-row items-center pt-4">
              {#if plan.id === currentPlanId}
                <div
                  class="btn btn-outline btn-success no-animation mx-auto w-[80%] cursor-default"
                >
                  Nuvarande plan
                </div>
              {:else}
                <Button
                  on:click={() =>
                    goto(`/account/subscribe/${plan.stripePriceId}`)}
                  >{callToAction}</Button
                >
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </section>
</RootContainer>
