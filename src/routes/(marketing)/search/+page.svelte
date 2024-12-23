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
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import { mediaQuery } from "svelte-legos";
  import Wavy from "src/lib/components/atoms/wavy.svelte";
  import { Button } from "src/lib/components/ui/button";
  import { Search, ArrowRightIcon } from "lucide-svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";

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
  <div class="bg-secondary min-h-44 w-full">
    <form
      class="text-center flex flex-col gap-y-4 w-full p-8"
      action="?/search"
      method="POST"
      use:enhance
    >
      <SecondaryTitle class="text-background"
        >Sök efter lärare och annonser</SecondaryTitle
      >
        <div class="flex items-start">
          <Form.Field form={searchForm} name="query" class="flex-1">
            <Form.Control let:attrs>
              <div class="relative bg-card rounded-sm rounded-r-none">
                <Search
                  class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
                />
                <Input
                  {...attrs}
                  type="text"
                  bind:value={$formData.query}
                  placeholder="Namn, titel, beskrivning, pris, etc."
                  class="pl-8 text-lg bg-card rounded-r-none"
                />
              </div>
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={$allErrors.length > 0 || $delayed}
            class="flex gap-x-2 items-center bg-card text-foreground rounded-l-none hover:bg-card hover:text-foreground"
          >
            {#if $delayed}
              <LoadingSpinner class="size-4" />
            {:else}
              <ArrowRightIcon class="size-4" />
            {/if}
          </Button>
        </div>
    </form>
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
  <div class="w-full bg-secondary flex flex-col items-center">
    <form
      class="text-center flex flex-col gap-y-4 w-full bg-secondary max-w-screen-sm"
      action="?/search"
      method="POST"
      use:enhance
    >
      <SecondaryTitle class="text-background"
        >Sök efter lärare och annonser</SecondaryTitle
      >
      <div class="flex items-start">
          <Form.Field form={searchForm} name="query" class="flex-1">
            <Form.Control let:attrs>
              <div class="relative bg-card rounded-sm rounded-r-none">
                <Search
                  class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
                />
                <Input
                  {...attrs}
                  type="text"
                  bind:value={$formData.query}
                  placeholder="Namn, titel, beskrivning, pris, etc."
                  class="pl-8 text-lg bg-card rounded-r-none"
                />
              </div>
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={$allErrors.length > 0 || $delayed}
            class="flex gap-x-2 items-center bg-card text-foreground rounded-l-none hover:bg-card hover:text-foreground"
          >
            {#if $delayed}
              <LoadingSpinner class="size-4" />
            {:else}
              <ArrowRightIcon class="size-4" />
            {/if}
          </Button>
        </div>
      </form>
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
