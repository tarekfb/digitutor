<script lang="ts">
  import {
    freeCredits,
    premiumPlan,
    pricingPlans,
    websiteName,
  } from "$lib/shared/constants/constants.ts";
  import type { PageData } from "./$types.ts";
  import { Button } from "src/lib/components/ui/button/index.js";
  import Container from "src/lib/components/templates/container.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import { goto } from "$app/navigation";
  import DisplayProfile from "src/lib/components/molecules/display-profile.svelte";
  import ReviewCarousel from "src/lib/components/organisms/review-carousel.svelte";
  import PricingModule from "src/lib/components/molecules/pricing-module.svelte";
  import Faq from "src/lib/components/molecules/faq.svelte";
  import Vector from "src/lib/icons/vector.svelte";

  export let data: PageData;
  $: ({ displayReviews, displayProfiles } = data);

  const cta = "Lär dig programmering från erfarna utvecklare";
  const subDescr = `Är du stressad inför en tenta, fast på en inlämning eller bara nyfiken på programmering? Skapa ett konto nu och få ${freeCredits} gratis kontaktförfrågningar till lärare - inget betalkort behövs.`;

  const getGridCols = (listLength: number): string => {
    if (listLength === 1) return "grid-cols-1";
    if (listLength === 2) return "grid-cols-2";
    if (listLength === 3) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };
  
  const maxWidth = "max-w-full md:max-w-screen-sm lg:max-w-screen-md";
  const yContainerPadding = "py-20 md:py-32";
  const xContainerPadding = "px-4 md:px-12";
  const bTitleMargin = "mb-6 md:mb-10";
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} startsida" />
</svelte:head>

<Container margin={false} class="gap-y-0 ">
  <section
    class="flex w-screen flex-col items-center gap-4 self-center {xContainerPadding} w-full pb-8 pt-4 md:flex-row md:justify-evenly md:py-32 lg:gap-8 xl:max-w-[80vw]"
  >
    <div class="flex flex-col justify-center gap-y-4 md:w-1/2 md:max-w-2xl">
      <PrimaryTitle class="text-4xl md:text-5xl ">{cta}</PrimaryTitle>
      <p class="text-2xl text-muted-foreground">{subDescr}</p>
      <Button
        class="icon-button wide-button flex"
        on:click={() => goto("/sign-up")}
        >Skapa konto
        <ArrowRight class="size-4" />
      </Button>
    </div>
    <Vector class="mt-8 md:mt-0 lg:max-h-[500px] lg:max-w-[500px] max-h-[400px] max-w-[400px]" />
  </section>

  {#if displayProfiles.length > 0}
    <div
      class="flex w-screen flex-col items-center self-center bg-secondary {yContainerPadding}"
    >
      <Container maxWidth margin={false} class="mx-4 md:mx-8" responsiveGap>
        <PrimaryTitle class=" text-center {bTitleMargin} text-background"
          >Se våra lärare</PrimaryTitle
        >
        <div class="grid {getGridCols(displayProfiles.length)} gap-4 md:gap-8">
          {#each displayProfiles as profile}
            <DisplayProfile {profile} />
          {/each}
        </div>
      </Container>
    </div>
  {/if}
  {#if displayReviews.length > 0}
    <div class="relative">
      <div
        class="flex w-screen flex-col items-center self-center bg-card {yContainerPadding}"
      >
        <Container maxWidth margin={false} class="mx-4 md:mx-8" responsiveGap>
          <PrimaryTitle class="{bTitleMargin} text-center "
            >Såhär säger våra användare</PrimaryTitle
          >
          <div class="relative z-10 -mb-36 md:-mb-48">
            <ReviewCarousel reviews={displayReviews} />
          </div>
        </Container>
      </div>
    </div>
  {/if}
  <div
    class="{displayReviews.length > 0
      ? 'mt-20 md:mt-32'
      : ''} flex w-screen flex-col items-center self-center bg-background {yContainerPadding}"
  >
    <Container maxWidth margin={false} class="mx-4 md:mx-8" responsiveGap>
      <PrimaryTitle class="{bTitleMargin} text-center  "
        >Generös gratisnivå och möjlighet att uppgradera när som helst
      </PrimaryTitle>
      <section
        class="flex w-full flex-wrap place-content-center gap-6 md:gap-10 lg:flex-row"
      >
        {#each pricingPlans as pricingPlan}
          <PricingModule
            {pricingPlan}
          />
        {/each}
      </section>
    </Container>
  </div>
  <div
    class="flex w-screen flex-col items-center self-center bg-secondary {xContainerPadding} {yContainerPadding} "
  >
    <PrimaryTitle class="{bTitleMargin} w-full text-center text-background"
      >Vanliga frågor och svar</PrimaryTitle
    >
    <Faq class={maxWidth} dark />
  </div>
  <!-- todo fix padding larger const -->
  <div
    class="flex w-screen flex-col items-center self-center {xContainerPadding} {yContainerPadding} "
  >
    <PrimaryTitle class="{bTitleMargin} w-full text-center "
      >Vill du lära ut?</PrimaryTitle
    >
    <p class="text-muted-foreground md:text-lg {maxWidth}">
      Vi söker alltid lärare. Som lärare betalar du ingenting för att undervisa
      på {websiteName}. Har du erfarenhet inom programmering? Skapa ett konto
      nedan.
    </p>
    <Button
      class="icon-button wide-button mt-4 w-full md:mt-6 "
      on:click={() => goto("/sign-up?role=teacher")}
      >Skapa konto som lärare
      <ArrowRight class="size-4" />
    </Button>
  </div>
</Container>