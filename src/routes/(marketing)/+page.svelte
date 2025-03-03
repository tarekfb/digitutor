<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import type { PageData } from "./$types.ts";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";
  import { Button } from "src/lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { languages } from "src/lib/shared/models/common.ts";
  import Container from "src/lib/components/templates/container.svelte";
  import SearchForm from "src/lib/components/organisms/search-form.svelte";
  import Wavy from "src/lib/components/atoms/wavy.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";
  import Navbar from "src/lib/components/organisms/navbar.svelte";
  import { logout } from "src/lib/shared/utils/utils.ts";
  import { Separator } from "src/lib/components/ui/separator/index.ts";

  export let data: PageData;
  $: ({ displayReviews, subjects, profile, supabase, session } = data);

  const cta = "Lär dig programmering från erfarna utvecklare";
  const subDescr = "Gratis just nu, alltid prisvärt.";
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} startsida" />
</svelte:head>

<Navbar {profile} logout={() => logout(supabase, session)}>
  <svelte:fragment slot="search-form">
      <SearchForm form={data.form} {subjects} />
  </svelte:fragment>
</Navbar>

<Container class="mt-0">
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
        <div class="background-gradient absolute h-full w-full"></div>
        <enhanced:img
          src="src/lib/assets/kampus.jpg"
          class="h-full w-full object-cover"
          alt=""
        />
      </div>
      <p class="text-2xl">{subDescr}</p>
      <Button class="flex w-full items-center gap-x-2 md:w-auto"
        >Kom igång
        <ArrowRight class="size-4" />
      </Button>
    </div>
    <!-- desktop -->
    <div class="hidden w-full flex-row justify-evenly gap-y-4 lg:flex">
      <div class="mr-5 flex w-1/2 max-w-2xl flex-col justify-center gap-y-4">
        <h1 class="heading text-5xl">{cta}</h1>
        <p class="text-2xl font-semibold">{subDescr}</p>
        <Button class="flex w-full items-center gap-x-2 md:w-auto"
          >Kom igång
          <ArrowRight class="size-4" />
        </Button>
      </div>
      <div
        class="ml-5 flex flex-grow items-center justify-center lg:max-w-[50vw]"
      >
        <enhanced:img
          src="src/lib/assets/kampus.jpg"
          class=" h-full w-full max-w-4xl object-cover"
          alt=""
        />
      </div>
    </div>
  </section>
  <Container maxWidth class="m-0 px-8" responsiveGap tag="main">
    <!-- <ProfileCarousel profiles={displayProfiles} /> -->
    <!-- atm unused but will bring back -->

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
                  class="h-auto min-w-32 max-w-full rounded-lg {colIndex > 0
                    ? 'hidden md:flex'
                    : ''}"
                />
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <p class="text-gradient mt-4 text-center text-xl font-bold md:text-3xl">
      Vill du lära ut på {websiteName}?
    </p>
    <Button
      on:click={() => goto("/sign-up?role=teacher")}
      class="w-full md:w-auto">Skapa konto som lärare</Button
    >
  </Container>
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
