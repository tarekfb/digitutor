<script lang="ts">
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import {
    searchSchema,
    type SearchResult as SearchResultType,
  } from "src/lib/shared/models/search";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";
  import SearchResultList from "src/lib/components/molecules/search-result-list.svelte";
  import RootContainer from "src/lib/components/molecules/root-container.svelte";
  import { mediaQuery } from "svelte-legos";
  import Wavy from "src/lib/components/atoms/wavy.svelte";

  const isDesktop = mediaQuery("(min-width: 768px)");

  export let data: PageData;
  $: ({ initResults, initMessage } = data);

  let isInit = true;
  let results: SearchResultType[] = [];

  const searchForm = superForm(data.form, {
    validators: zodClient(searchSchema),
    onUpdate({ form, result }) {
      if (form.valid && result.data) {
        results = result.data.formatted as SearchResultType[];
        isInit = false;
      }
    },
  });
  const { form: formData, enhance, delayed, message, allErrors } = searchForm;
</script>

{#if !$isDesktop}
  <div class="bg-accent min-h-44">
    <form
      class="text-center flex flex-col gap-y-4 w-full p-8"
      action="?/search"
      method="POST"
      use:enhance
    >
      <SecondaryTitle class="text-background"
        >Sök efter lärare och annonser</SecondaryTitle
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
          <Form.FieldErrors class="text-destructive-secondary" />
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
  </div>
  <Wavy class="overflow-x-hidden -mt-4" />
  {#if $message}
    <div class="p-4">
      <FormMessage {message} scroll scrollTo="end" />
    </div>
  {:else if isInit && initResults.length > 0}
    <SearchResultList results={initResults} />
  {:else if initMessage}
    <div class="p-4">
      <AlertMessage
        title={initMessage.title}
        description={initMessage.description}
        variant={initMessage.variant}
      />
    </div>
  {:else if results.length > 0}
    <SearchResultList {results} />
  {:else}
    <div class="p-4">
      <AlertMessage
        title="Inga träffar på din sökning"
        description="Testa söka på en lärares namn, eller en annons titel, beskrivning eller pris."
      />
    </div>
  {/if}
{:else}
  <RootContainer>
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

      {#if isInit && initResults.length > 0}
        <SearchResultList results={initResults} />
      {:else if initMessage}
        <AlertMessage
          title={initMessage.title}
          description={initMessage.description}
          variant={initMessage.variant}
        />
      {:else if $message}
        <FormMessage {message} scroll scrollTo="end" />
      {:else if results.length > 0}
        <SearchResultList {results} />
      {:else}
        <AlertMessage
          title="Inga träffar på din sökning"
          description="Testa söka på en lärares namn, eller en annons titel, beskrivning eller pris."
        />
      {/if}
    </div>
  </RootContainer>
{/if}
