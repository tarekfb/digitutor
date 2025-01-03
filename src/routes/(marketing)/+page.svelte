<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import { websiteName } from "$lib/shared/constants/constants";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { searchSchema } from "src/lib/shared/models/search";
  import ProfileCarousel from "src/lib/components/organisms/profile-carousel.svelte";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";
  import { Button } from "src/lib/components/ui/button";
  import { goto } from "$app/navigation";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { languages } from "src/lib/shared/models/common";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import SearchForm from "src/lib/components/organisms/search-form.svelte";
  import Wavy from "src/lib/components/atoms/wavy.svelte";

  export let data: PageData;
  $: ({ displayProfiles, displayReviews, subjects } = data);
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
      <div class="px-2 text-3xl font-semibold md:text-5xl">
        Vill du bli utvecklare, klara tentan eller bara
        <div>
          slipa på din <Carousel.Root
            class="content inline-flex h-10 w-60  items-center md:h-14"
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
      <div class="md:mt-6">
        <h2 class="px-2 text-3xl font-semibold md:text-5xl">
          Spana in våra lärare
        </h2>
        <h3>
          <span
            class="flex items-center justify-center gap-y-2 py-2 text-xl md:text-3xl"
          >
            Eller <Button
              variant="ghost"
              on:click={() => goto("/sign-up")}
              class="m-0 h-10 px-1 text-2xl font-normal lowercase tracking-normal text-background underline decoration-third decoration-4 hover:bg-secondary hover:decoration-accent md:px-2 md:text-4xl md:decoration-[6px]"
              >skapa ett konto</Button
            >direkt
          </span>
        </h3>
      </div>
    </div>

    <div
      class="flex w-full max-w-screen-sm flex-col items-center justify-center gap-y-4 md:mt-4"
    >
      <SearchForm form={data.form} {subjects} />
    </div>
  </div>
  <Wavy class="-mx-8 -mt-8" />

  <ProfileCarousel profiles={displayProfiles} />

  {#if displayReviews.length > 0}
    <p class="text-gradient my-4 text-center text-3xl font-bold md:text-5xl">
      Vad våra användare säger
    </p>
    <div
      class="flex flex-col gap-x-8 gap-y-4 md:mb-6 md:grid md:grid-cols-2 md:flex-row md:gap-y-6"
    >
      {#each displayReviews as review}
        <ReviewCardExtra {review} class="h-fit w-64" />
      {/each}
    </div>
  {/if}
  <p class="text-gradient mt-4 text-center text-xl font-bold md:text-3xl">
    Vill du lära ut på {websiteName}?
  </p>
  <Button on:click={() => goto("/sign-up?role=teacher")}
    >Skapa konto som lärare</Button
  >
</RootContainer>

<!-- <div
      class="flex flex-col justify-center items-center gap-y-4 w-full max-w-screen-sm"
    >
      <form
        class="text-center flex flex-col gap-y-4 w-full"
        action="?/search"
        method="POST"
        use:enhance
      >
      </form>
      <FormMessage {message} scroll scrollTo="end" />
    </div>
  </div> 
-->
