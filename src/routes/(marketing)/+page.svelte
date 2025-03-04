<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import type { PageData } from "./$types.ts";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";
  import { Button } from "src/lib/components/ui/button/index.js";
  import Container from "src/lib/components/templates/container.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import { goto } from "$app/navigation";
  import ProfileCarousel from "src/lib/components/organisms/profile-carousel.svelte";
  import DisplayProfile from "src/lib/components/molecules/display-profile.svelte";
  export let data: PageData;
  $: ({ displayReviews, displayProfiles } = data);

  const cta = "Lär dig programmering från erfarna utvecklare";
  const subDescr = "Gratis just nu, alltid prisvärt.";
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} startsida" />
</svelte:head>

<Container margin={false}>
  <section
    class="flex flex-col items-start gap-y-4 self-center lg:w-full lg:flex-row lg:justify-evenly lg:gap-8 xl:max-w-[80vw]"
  >
    <!-- mobile -->
    <div class="flex w-full flex-col gap-y-4 lg:hidden">
      <div
        class="relative -mx-4 flex h-full flex-col items-center justify-end md:-mx-8 lg:mx-0 lg:w-1/2"
      >
        <h1
          class="heading absolute z-10 m-4 self-start text-2xl !font-bold text-background md:m-8 md:text-3xl lg:text-4xl"
        >
          {cta}
        </h1>
        <div class="background-gradient absolute size-full"></div>
        <enhanced:img
          src="src/lib/assets/kampus.jpg"
          class="size-full object-cover"
          alt=""
        />
      </div>
      <p class="text-2xl">{subDescr}</p>
      <Button
        class="flex w-full items-center gap-x-2 md:w-auto"
        on:click={() => goto("/sign-up")}
        >Skapa konto
        <ArrowRight class="size-4" />
      </Button>
    </div>
    <!-- desktop -->
    <div class="hidden w-full flex-row justify-evenly gap-y-4 px-8 lg:flex">
      <div class="mr-5 flex w-1/2 max-w-2xl flex-col justify-center gap-y-4">
        <h1 class="heading text-5xl">{cta}</h1>
        <p class="text-2xl font-semibold">{subDescr}</p>
        <Button
          class="flex w-full max-w-72 items-center gap-x-2 md:w-auto"
          on:click={() => goto("/sign-up")}
          >Skapa konto
          <ArrowRight class="size-4" />
        </Button>
      </div>
      <div
        class="ml-5 flex flex-grow items-center justify-center lg:max-w-[50vw]"
      >
        <enhanced:img
          src="src/lib/assets/kampus.jpg"
          class="size-full max-w-4xl object-cover"
          alt=""
        />
      </div>
    </div>
  </section>

  <div class="flex w-screen flex-col items-center self-center bg-card">
    <Container maxWidth margin={false} responsiveGap>
      {#if displayReviews.length > 0}
        <div class="flex flex-col items-center gap-y-2">
          <PrimaryTitle class="text-gradient my-4 text-center ">
            Se våra lärare
          </PrimaryTitle>
          <div
            class="grid grid-cols-1 gap-4 {displayReviews.length > 1
              ? 'md:grid-cols-2'
              : ''}"
          >
            {#each Array(2) as _, colIndex}
              <div class="flex flex-col gap-4">
                {#each displayProfiles.filter((_, index) => index % 4 === colIndex) as profile}
                  <DisplayProfile {profile} />
                {/each}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </Container>
  </div>
  <div class="flex w-screen flex-col items-center self-center">
    <Container maxWidth margin={false} responsiveGap>
      {#if displayReviews.length > 0}
        <div class="flex flex-col items-center gap-y-2">
          <PrimaryTitle class="text-gradient my-4 text-center ">
            Vad våra användare säger
          </PrimaryTitle>
          <div
            class="grid grid-cols-1 gap-4 {displayReviews.length > 1
              ? 'md:grid-cols-2'
              : ''}"
          >
            {#each Array(2) as _, colIndex}
              <div class="flex flex-col gap-4">
                {#each displayReviews.filter((_, index) => index % 4 === colIndex) as review}
                  <ReviewCardExtra
                    truncate={40}
                    {review}
                    class="h-auto min-w-32 max-w-full rounded-lg bg-card {colIndex >
                    0
                      ? 'hidden md:flex'
                      : ''}"
                  />
                {/each}
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </Container>
  </div>
  <!-- <div class="flex w-screen flex-col items-center self-center">
    <Container maxWidth responsiveGap>
      <PrimaryTitle class="text-gradient my-4 text-center ">
        Vanliga frågor och svar
      </PrimaryTitle>
    </Container>
  </div> -->
</Container>

<style lang="postcss">
  .background-gradient {
    background: linear-gradient(
      to bottom,
      hsla(0, 0%, 0%, 0) 0%,
      hsla(0, 0%, 0%, 0.01) 13.7%,
      hsla(0, 0%, 0%, 0.036) 25.6%,
      hsla(0, 0%, 0%, 0.076) 35.9%,
      hsla(0, 0%, 0%, 0.128) 44.9%,
      hsla(0, 0%, 0%, 0.189) 52.6%,
      hsla(0, 0%, 0%, 0.259) 59.2%,
      hsla(0, 0%, 0%, 0.334) 65%,
      hsla(0, 0%, 0%, 0.414) 70.1%,
      hsla(0, 0%, 0%, 0.495) 74.6%,
      hsla(0, 0%, 0%, 0.577) 78.7%,
      hsla(0, 0%, 0%, 0.657) 82.7%,
      hsla(0, 0%, 0%, 0.733) 86.6%,
      hsla(0, 0%, 0%, 0.804) 90.7%,
      hsla(0, 0%, 0%, 0.867) 95.1%,
      hsla(0, 0%, 0%, 0.92) 100%
    );
  }

  @media (min-width: 768px) {
    .background-gradient {
      background: linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0.003) 15.2%,
        hsla(0, 0%, 0%, 0.012) 28.2%,
        hsla(0, 0%, 0%, 0.029) 39.1%,
        hsla(0, 0%, 0%, 0.052) 48.3%,
        hsla(0, 0%, 0%, 0.083) 55.9%,
        hsla(0, 0%, 0%, 0.122) 62.3%,
        hsla(0, 0%, 0%, 0.17) 67.6%,
        hsla(0, 0%, 0%, 0.227) 72%,
        hsla(0, 0%, 0%, 0.294) 75.9%,
        hsla(0, 0%, 0%, 0.371) 79.4%,
        hsla(0, 0%, 0%, 0.458) 82.8%,
        hsla(0, 0%, 0%, 0.556) 86.3%,
        hsla(0, 0%, 0%, 0.665) 90.2%,
        hsla(0, 0%, 0%, 0.786) 94.7%,
        hsla(0, 0%, 0%, 0.92) 100%
      );
    }
  }
</style>
