<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import { searchSchema } from "src/lib/shared/models/search";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";

  export let data: PageData;

  const searchForm = superForm(data.form, {
    validators: zodClient(searchSchema),
  });
  const { form: formData, enhance, delayed, message, allErrors } = searchForm;
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} Startsida" />
</svelte:head>

<div class="flex flex-col items-center gap-y-4 text-center py-12 md:gap-y-8">
  <div class="max-w-xl">
    <div class="text-3xl md:text-4xl font-bold text-gradient">
      {websiteName}
    </div>

    <div class="text-4xl md:text-6xl font-bold px-2" style="line-height: 1.2;">
      Den
      <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
        >största</span
      >,
      <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
        >bästa</span
      >, och
      <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
        >vackraste</span
      >
      <span> placeholdern för blabla</span>
    </div>
  </div>
  {#if !data.session}
    <Button on:click={() => goto("/sign-up")}>Skapa konto</Button>
  {/if}
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
    <SecondaryTitle>Sök efter lärare och annonser</SecondaryTitle>
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

<div class="min-h-[60vh]">
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
</div>
