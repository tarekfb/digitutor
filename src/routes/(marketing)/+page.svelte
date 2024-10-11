<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import { searchSchema } from "src/lib/shared/models/search";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import Autoplay from "embla-carousel-autoplay";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { goto } from "$app/navigation";
  import { Button } from "src/lib/components/ui/button";
  import { mediaQuery } from "svelte-legos";
  import { Subjects } from "src/lib/shared/models/common";
  import { Terminal } from "lucide-svelte";

  export let data: PageData;
  $: ({ displayReviews } = data);

  const isDesktop = mediaQuery("(min-width: 768px)");

  const searchForm = superForm(data.form, {
    validators: zodClient(searchSchema),
  });
  const { form: formData, enhance, delayed, message, allErrors } = searchForm;
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} Startsida" />
</svelte:head>

<div
  class="flex flex-col items-center gap-y-8 mb-4 text-center md:gap-y-8 max-w-xl"
>
  <div class="text-4xl md:text-6xl font-bold px-2" style="line-height: 1.2;">
    Vill du bli
    <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
      >utvecklare</span
    >,
    <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
      >slipa på din javascript</span
    >
    eller bara
    <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
      >klara tentan</span
    >?
  </div>
  <h2 class="text-4xl font-bold px-2 text-gradient">Spana in våra lärare</h2>
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

{#if displayReviews.length > 0}
  <Carousel.Root
    class="w-5/6 max-w-xs md:max-w-md p-2"
    plugins={[
      Autoplay({
        delay: 3000,
      }),
    ]}
  >
    <Carousel.Content>
      {#each displayReviews as review}
        {#if !$isDesktop}
          <Carousel.Item class="flex flex-col start gap-y-4">
            <a href="/profile/{review.id}" class="h-full w-full">
              <img
                alt="profile avatar"
                class="rounded-lg object-cover h-full w-full"
                src={review.avatarUrl}
              />
            </a>
            <div class="flex flex-col justify-between gap-y-4">
              <div
                class="flex flex-col gap-y-0.5 text-muted-foreground text-xl md:text-2xl"
              >
                <div class="flex justify-between gap-x-1 flex-l flex-wrap">
                  <SecondaryTitle class="font-semibold"
                    >{review.firstName}</SecondaryTitle
                  >
                  <Stars size={5} rating={review.avgRating} />
                </div>
                <ul>
                  {#each review.subjects as subject, i}
                    {#if i < 4}
                      <li class="flex gap-x-2 items-end">
                        <Terminal class="w-5 h-5 text-accent" />
                        <p class="font-mono text-base">{Subjects[subject]}</p>
                      </li>
                    {/if}
                  {/each}
                </ul>
              </div>
              <Button on:click={() => goto(`/profile/${review.id}`)}
                >Profil</Button
              >
            </div>
          </Carousel.Item>
        {:else}
          <Carousel.Item class="flex justify-evenly gap-x-4">
            <a href="/profile/{review.id}" class="h-full w-full">
              <img
                alt="profile avatar"
                class="rounded-lg object-cover h-full w-full"
                src={review.avatarUrl}
              />
            </a>
            <div class="flex flex-col justify-between gap-y-4">
              <div
                class="flex flex-col gap-y-0.5 text-muted-foreground text-xl md:text-2xl"
              >
                <SecondaryTitle class=" font-semibold"
                  >{review.firstName}</SecondaryTitle
                >
                <Stars size={5} rating={review.avgRating} />
                <ul>
                  {#each review.subjects as subject, i}
                    {#if i < 6}
                      <li class="flex gap-x-2 items-end">
                        <Terminal class="w-5 h-5 text-accent" />
                        <p class="font-mono text-base">{Subjects[subject]}</p>
                      </li>
                    {/if}
                  {/each}
                </ul>
              </div>
              <Button
                on:click={() => goto(`/profile/${review.id}`)}
                class="md:min-w-wider">Profil</Button
              >
            </div>
          </Carousel.Item>
        {/if}
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>
{/if}

<!-- <div class="min-h-[60vh]">
  <div class="pt-20 pb-8 px-7">
    <div class="max-w-lg mx-auto text-center">
      <div class="text-3xl md:text-5xl font-bold text-gradient">
        Spana in våra lärare
      </div>
      <div class="mt-6 text-xl font-bold">
        Hör av dig och
        <span
          class="underline decoration-accent decoration-[3px] md:decoration-[4px]"
        >
          uppgradera dina skills idag
        </span>
      </div>
    </div>

    <div class="flex flex-col gap-y-4 mt-12">
      {#each data.listings as listing}
        <ListingCard {listing} publicView={true} clickable />
      {:else}
        <p class="text-center">Det finns inga annonser ännu.</p>
      {/each}
    </div>
  </div>
</div> -->
