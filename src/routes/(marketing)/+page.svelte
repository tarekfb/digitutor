<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import { websiteName } from "$lib/shared/constants/constants";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import { searchSchema } from "src/lib/shared/models/search";
  import ProfileCarousel from "src/lib/components/organisms/profile-carousel.svelte";
  import ReviewCardExtra from "src/lib/components/molecules/review-card-extra.svelte";
  import { Button } from "src/lib/components/ui/button";
  import { goto } from "$app/navigation";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import { languages } from "src/lib/shared/models/common";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import Wavy from "src/lib/components/atoms/wavy.svelte";

  export let data: PageData;
  $: ({ displayProfiles, displayReviews } = data);

  const searchForm = superForm(data.form, {
    validators: zodClient(searchSchema),
  });
  const { form: formData, enhance, delayed, message, allErrors } = searchForm;
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} Startsida" />
</svelte:head>

<RootContainer>
  <div class="flex flex-col items-center -mt-8 p-8 w-screen bg-accent">
    <div
      class="flex flex-col items-center gap-y-8 mb-4 text-center md:gap-y-8 text-background"
    >
      <div
        class="text-3xl md:text-5xl font-semibold px-2"
      >
        Vill du bli
        <span
          class="underline decoration-primary decoration-4 md:decoration-[6px]"
          >utvecklare</span
        >,
        <div>
          slipa på din <Carousel.Root
            class="inline-flex items-center content w-60"
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <Carousel.Content class="flex items-center ">
              {#each languages as lang}
                <Carousel.Item
                  class="underline decoration-primary decoration-4 md:decoration-[6px]"
                >
                  {lang.label}
                </Carousel.Item>
              {/each}
            </Carousel.Content>
          </Carousel.Root>
        </div>
        eller bara
        <span
          class="underline decoration-primary decoration-4 md:decoration-[6px]"
          >klara tentan</span
        >?
      </div>
      <div>
        <h2 class="text-3xl md:text-5xl font-semibold px-2">
          Spana in våra lärare
        </h2>
        <h3>
          <span
            class="flex justify-center items-center gap-y-2 text-2xl md:text-4xl py-2"
          >
            Eller <Button
              variant="ghost"
              on:click={() => goto("/sign-up")}
              class="text-2xl md:text-4xl lowercase  m-0 px-1 md:px-2 tracking-normal h-10 text-primary hover:text-background"
              >skapa ett konto</Button
            >direkt
          </span>
        </h3>
      </div>
    </div>

    <div
      class="flex flex-col justify-center items-center gap-y-4 w-full max-w-screen-sm"
    >
      <form
        class="text-center flex flex-col gap-y-4 w-full"
        action="?/search"
        method="POST"
        use:enhance
      >
        <div class="flex justify-between gap-x-2 md:gap-x-4 items-start">
          <Form.Field form={searchForm} name="query" class="flex-1">
            <Form.Control let:attrs>
              <Input
                {...attrs}
                type="text"
                bind:value={$formData.query}
                placeholder="Namn, titel, beskrivning, pris, etc."
                class="text-lg bg-card"
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <FormSubmit
            {delayed}
            {allErrors}
            text="Sök"
            loadingText=""
            class="w-12"
          />
        </div>
      </form>

      <FormMessage {message} scroll scrollTo="end" />
    </div>
  </div>
  <Wavy class="-mx-8 -mt-8" />

  <ProfileCarousel profiles={displayProfiles} />

  {#if displayReviews.length > 0}
    <p class="text-3xl md:text-5xl font-bold text-center text-gradient my-4">
      Vad våra användare säger
    </p>
    <div
      class="flex flex-col gap-y-4 md:flex-row md:grid md:grid-cols-2 gap-x-8 md:gap-y-6 md:mb-6"
    >
      {#each displayReviews as review}
        <ReviewCardExtra {review} class="w-64 h-fit" />
      {/each}
    </div>
  {/if}
  <p class="text-xl md:text-3xl font-bold text-center text-gradient mt-4">
    Vill du lära ut på {websiteName}?
  </p>
  <Button on:click={() => goto("/sign-up?role=teacher")}
    >Skapa konto som lärare</Button
  >
</RootContainer>
