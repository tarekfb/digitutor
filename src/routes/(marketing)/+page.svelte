<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import type { PageData } from "./$types.ts";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";
  import { Button } from "src/lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { languages } from "src/lib/shared/models/common.ts";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import SearchForm from "src/lib/components/organisms/search-form.svelte";
  import Wavy from "src/lib/components/atoms/wavy.svelte";
  import Search from "lucide-svelte/icons/search";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";

  export let data: PageData;
  $: ({ displayReviews, subjects } = data);
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} startsida" />
</svelte:head>

<RootContainer>
  <div class="-mt-8 flex w-screen flex-col items-center bg-secondary p-8">
    <div
      class="mb-4 flex flex-col items-center gap-y-2 text-center text-background"
    >
      <div class="heading px-2 text-3xl font-semibold md:text-6xl">
        Vill du öva på din
        <div>
          <Carousel.Root
            class="content inline-flex h-10 max-w-96  items-center md:h-14"
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <Carousel.Content class="flex items-center ">
              {#each languages as lang}
                <Carousel.Item>
                  <a
                    href="/search?q={lang.title}"
                    class="underline decoration-third decoration-4 hover:decoration-accent md:decoration-[6px]"
                  >
                    {lang.title}?
                  </a>
                </Carousel.Item>
              {/each}
            </Carousel.Content>
          </Carousel.Root>
        </div>
      </div>
      <div class="mt-4 md:mt-6">
        <h2
          class="heading flex items-center gap-x-2 px-2 text-xl font-semibold md:text-3xl"
        >
          <Search class="size-4 md:size-6" /> Sök bland våra lärare
        </h2>
      </div>
    </div>

    <div
      class="flex w-full max-w-screen-sm flex-col items-center justify-center gap-y-4 md:mt-4"
    >
      <SearchForm form={data.form} {subjects} />
    </div>
    <h3>
      <span
        class="mt-2 flex items-center justify-center gap-y-2 py-2 text-xl text-background md:mt-4 md:text-3xl"
      >
        Eller
        <Button
          variant="ghost"
          on:click={() => goto("/sign-up")}
          class="m-0 h-10 px-1 text-xl font-normal lowercase tracking-normal text-background underline decoration-third decoration-4 hover:bg-secondary hover:decoration-accent md:px-2 md:text-3xl md:decoration-[6px]"
          >skapa ett gratis konto</Button
        >direkt
      </span>
    </h3>
  </div>
  <Wavy class="-mx-8 -mt-8" />
  <RootContainer maxWidth class="m-0 px-8" responsiveGap>
    <!-- <ProfileCarousel profiles={displayProfiles} /> -->
    <!-- atm unused but will bring back -->

    <div class="flex flex-col items-center gap-y-2">
      {#if displayReviews.length > 0}
        <PrimaryTitle class="text-gradient my-4 whitespace-normal text-center ">
          Vad våra användare säger
        </PrimaryTitle>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-2">
          {#each Array(2) as _, colIndex}
            <div class="flex flex-col gap-4">
              {#each displayReviews.filter((_, index) => index % 4 === colIndex) as review}
                <ReviewCardExtra
                  truncate={40}
                  {review}
                  class="h-auto min-w-32 max-w-full rounded-lg"
                />
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <p class="text-gradient mt-4 text-center text-xl font-bold md:text-3xl">
      Vill du lära ut på {websiteName}?
    </p>
    <Button on:click={() => goto("/sign-up?role=teacher")}
      >Skapa konto som lärare</Button
    >
  </RootContainer>
</RootContainer>
