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

<div class="flex flex-col items-center -mt-8 p-8 w-screen bg-accent">
  <div
    class="flex flex-col items-center gap-y-8 mb-4 text-center md:gap-y-8 text-background"
  >
    <div class="text-3xl md:text-5xl font-semibold px-2" style="line-height: 1.2;">
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
      <h2 class="text-3xl md:text-5xl font-semibold px-2">Spana in våra lärare</h2>
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
    class="flex flex-col justify-center items-center gap-y-4 w-full max-w-[650px]"
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
<svg class="fill-current text-accent -mx-8 -mt-8" viewBox="0 0 900 100"
  ><path
    d="M0 51L10 51.5C20 52 40 53 60 58.2C80 63.3 100 72.7 120 72.7C140 72.7 160 63.3 180 57C200 50.7 220 47.3 240 49.8C260 52.3 280 60.7 300 62.2C320 63.7 340 58.3 360 58.3C380 58.3 400 63.7 420 61.5C440 59.3 460 49.7 480 50.7C500 51.7 520 63.3 540 68.5C560 73.7 580 72.3 600 73.5C620 74.7 640 78.3 660 77.3C680 76.3 700 70.7 720 65.5C740 60.3 760 55.7 780 58.2C800 60.7 820 70.3 840 73.8C860 77.3 880 74.7 890 73.3L900 72L900 0L890 0C880 0 860 0 840 0C820 0 800 0 780 0C760 0 740 0 720 0C700 0 680 0 660 0C640 0 620 0 600 0C580 0 560 0 540 0C520 0 500 0 480 0C460 0 440 0 420 0C400 0 380 0 360 0C340 0 320 0 300 0C280 0 260 0 240 0C220 0 200 0 180 0C160 0 140 0 120 0C100 0 80 0 60 0C40 0 20 0 10 0L0 0Z"
  /></svg
>

<ProfileCarousel profiles={displayProfiles} />

{#if displayReviews.length > 0}
  <p class="text-3xl md:text-5xl font-bold text-center text-gradient my-4">
    Vad våra användare säger
  </p>
  <div
    class="flex flex-col gap-y-4 md:flex-row md:grid md:grid-cols-2 gap-x-8 md:gap-y-6 md:mb-6"
  >
    {#each displayReviews as review}
      <ReviewCardExtra {review} class="w-64" />
    {/each}
  </div>
{/if}
<p class="text-xl md:text-3xl font-bold text-center text-gradient mt-4">
  Vill du lära ut på {websiteName}?
</p>
<Button on:click={() => goto("/sign-up?role=teacher")}
  >Skapa konto som lärare</Button
>
<!-- 
<div class="font-bold text-center my-4">
  <span
    class="flex justify-center items-center gap-y-2 text-2xl md:text-4xl py-2"
  >
    Kom igång och <Button
      variant="ghost"
      on:click={() => goto("/sign-up")}
      class="p-4 text-2xl md:text-4xl lowercase  text-gradient "
      >skapa ett konto</Button
    >
  </span>
  <p class="text-xl md:text-2xl">Helt gratis och inget betalkort behövs</p>
</div> -->
