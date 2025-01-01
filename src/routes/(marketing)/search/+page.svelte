<script lang="ts">
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import {
    searchSchema,
    type SearchResult as SearchResultType,
  } from "src/lib/shared/models/search";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";
  import SearchResultList from "src/lib/components/molecules/search-result-list.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { mediaQuery } from "svelte-legos";
  import Wavy from "src/lib/components/atoms/wavy.svelte";
  import SearchForm from "src/lib/components/organisms/search-form.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";

  const isDesktop = mediaQuery("(min-width: 768px)");

  export let data: PageData;
  $: ({ initResults, initMessage, subjects } = data);

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
  const { form: formData, message } = searchForm;
</script>

{#if !$isDesktop}
  <div class="bg-secondary min-h-44 w-full">
    <div
      class="flex flex-col justify-center md:mt-4 items-center gap-y-4 w-full max-w-screen-sm"
    >
      <SearchForm form={data.form} {subjects} />
    </div>
  </div>
  <Wavy class="overflow-x-hidden -mt-4" />
  {#if $message}
    <div class="p-4">
      <FormMessage {message} scroll scrollTo="end" />
    </div>
  {:else if isInit && initResults.length > 0}
    <SearchResultList results={initResults} searchTerm={$formData.query} />
  {:else if initMessage}
    <div class="p-4">
      <AlertMessage
        title={initMessage.title}
        description={initMessage.description}
        variant={initMessage.variant}
      />
    </div>
  {:else if results.length > 0}
    <SearchResultList {results} searchTerm={$formData.query} />
  {:else}
    <div class="p-4">
      <AlertMessage
        title="Inga träffar på din sökning"
        description="Testa söka på en lärares namn, eller en annons titel, beskrivning eller pris."
      />
    </div>
  {/if}
{:else}
  <div class="w-full bg-secondary flex justify-center">
    <div class="w-full flex flex-col  gap-y-4 max-w-screen-sm">
      <PrimaryTitle class="heading text-background self-center md:mb-4">Sök bland lärare</PrimaryTitle>
      <SearchForm form={data.form} {subjects} formStyling="bg-secondary" />
    </div>
  </div>
  <Wavy />
  <RootContainer class="w-full md:max-w-sm lg:max-w-screen-md">
    {#if isInit && initResults.length > 0}
      <SearchResultList results={initResults} searchTerm={$formData.query} />
    {:else if initMessage}
      <AlertMessage
        title={initMessage.title}
        description={initMessage.description}
        variant={initMessage.variant}
      />
    {:else if $message}
      <FormMessage {message} />
    {:else if results.length > 0}
      <SearchResultList {results} searchTerm={$formData.query} />
    {:else}
      <AlertMessage
        title="Inga träffar på din sökning"
        description="Testa söka på en lärares namn, eller en annons titel, beskrivning eller pris."
      />
    {/if}
  </RootContainer>
{/if}
