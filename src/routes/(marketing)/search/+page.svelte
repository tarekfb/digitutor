<script lang="ts">
  import Search from "lucide-svelte/icons/search";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import Check from "lucide-svelte/icons/check";
  import ChevronUp from "lucide-svelte/icons/chevron-up";
  import X from "lucide-svelte/icons/x";
  import { createCombobox, melt } from "@melt-ui/svelte";
  import { fly } from "svelte/transition";
  import type { PageData } from "./$types.ts";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import {
    searchSchema,
    type SearchResult as SearchResultType,
    type SortingSearchOption,
  } from "src/lib/shared/models/search.ts";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";
  import SearchResultList from "src/lib/components/molecules/search-result-list.svelte";
  import Container from "src/lib/components/templates/container.svelte";
  import Wavy from "src/lib/components/atoms/wavy.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import { Input } from "src/lib/components/ui/input/index.js";
  import Button from "src/lib/components/ui/button/button.svelte";
  import { languages } from "src/lib/shared/models/common.ts";
  import { page } from "$app/stores";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
  import SearchSuggestion from "src/lib/components/molecules/search-suggestion.svelte";
  import SearchSubjectButton from "src/lib/components/atoms/search-subject-button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import {
    defaultSort,
    sortSearchResults,
  } from "src/lib/shared/utils/search/utils.ts";

  export let data: PageData;
  $: ({ initMessage, subjects } = data);

  const handleUndefinedBug =
    subjects && subjects.length > 0 ? subjects : languages;
  let isInit = true;
  let results: SearchResultType[] = data.initResults;

  const searchForm = superForm(data.form, {
    validators: zodClient(searchSchema),
    onUpdate({ form, result }) {
      if (form.valid && result.data) {
        results = result.data.formatted as SearchResultType[];
        if (isInit) isInit = false;
      }
    },
    resetForm: false,
  });

  const {
    form: formData,
    enhance,
    delayed,
    message,
    allErrors,
    submitting,
    submit,
    reset,
  } = searchForm;

  const {
    elements: { menu, input, option, label, hiddenInput },
    states: { open, inputValue, touchedInput, selected },
    helpers: { isSelected },
  } = createCombobox<string, true>({
    forceVisible: true,
    multiple: true,
    onSelectedChange: ({ next }) => {
      if (next && next[0] && next[0].value)
        $formData.subjects = next.map((subject) => subject.value).join(" ");
      else $formData.subjects = "";
      return next;
    },
  });

  $: filteredSubjects = $touchedInput
    ? handleUndefinedBug?.filter(({ title, altTitle }) => {
        const normalizedInput = $inputValue.toLowerCase();
        return (
          title.toLowerCase().includes(normalizedInput) ||
          altTitle?.toLowerCase().includes(normalizedInput)
        );
      })
    : (handleUndefinedBug ?? []);

  const messageStyling = "w-full md:w-auto md:min-w-[30vw]";

  $: getSearchTerm = () => {
    if ($formData.subjects) return $formData.subjects.split(" ")[0];
    if ($formData.query) return $formData.query;
    return $page.url.searchParams.get("q") ?? "";
  };

  const resetForm = () => {
    if (isInit) isInit = false;
    if ($selected) $selected = undefined;
    sortingId = defaultSort.id;
    $message = undefined;
    reset({
      newState: { subjects: "", query: "" },
      data: { subjects: "", query: "" },
    });
    const queryInput = document.getElementById(
      "query-input",
    ) as HTMLInputElement | null;
    if (queryInput) queryInput.value = "";
  };

  const getAll = async () => {
    resetForm();
    submit();
  };

  const setSuggestion = (subjectName: string): void => {
    resetForm();
    $selected = [{ label: subjectName, value: subjectName }];
    submit();
  };

  let sortingId: SortingSearchOption["id"] = defaultSort.id;
</script>

<svelte:head>
  <title>
    {websiteName} | Sök lärare</title
  >
</svelte:head>

<section class="flex min-h-44 w-full justify-center bg-secondary p-8">
  <div class="flex w-full max-w-screen-sm flex-col gap-y-4">
    <PrimaryTitle class="heading self-center text-background md:mb-4"
      >Sök bland våra lärare</PrimaryTitle
    >
    <Button
      variant="link"
      class="text-md -my-4 normal-case text-background md:text-lg"
      on:click={getAll}
    >
      Visa alla</Button
    >
    <form
      class="flex w-full flex-col gap-y-4 bg-secondary text-center"
      action="?/search"
      method="POST"
      use:enhance
    >
      <div class="flex min-w-72 items-start">
        <Form.Field form={searchForm} name="subjects" class="w-20 flex-auto">
          <Form.Control let:attrs>
            <div class="flex flex-col gap-1">
              <!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
              <!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
              <label use:melt={$label} hidden>Välj teknologi</label>
              <input
                type="hidden"
                use:melt={$hiddenInput}
                {...attrs}
                value={$formData.subjects}
              />

              <div class="relative">
                <input
                  use:melt={$input}
                  class="text-md flex h-10 w-full items-center justify-between rounded-lg
          rounded-r-none bg-card px-3 pr-6 placeholder:text-muted-foreground"
                  placeholder="Välj teknologi"
                />
                <div
                  class="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-secondary"
                >
                  {#if $open}
                    <ChevronUp class="size-4" />
                  {:else}
                    <ChevronDown class="size-4" />
                  {/if}
                </div>
              </div>
            </div>
            <Form.FieldErrors class="" />
          </Form.Control>
        </Form.Field>
        <Form.Field
          form={searchForm}
          name="query"
          class="w-28 flex-none md:w-64"
        >
          <Form.Control let:attrs>
            <Input
              {...attrs}
              id="query-input"
              type="text"
              autocomplete="false"
              bind:value={$formData.query}
              placeholder="Sök lärare"
              class="text-md rounded-l-none rounded-r-none bg-card text-muted-foreground placeholder:text-muted-foreground"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Button
          type="submit"
          variant="accent-third"
          size="icon"
          disabled={$allErrors.length > 0 || $delayed}
          class="flex flex-none items-center justify-center gap-x-2 rounded-l-none"
        >
          {#if $delayed}
            <LoadingSpinner class="size-4" />
          {:else}
            <Search class="size-4" />
          {/if}
        </Button>
      </div>
    </form>

    <div class="-mt-4 flex w-full justify-between gap-x-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            variant="outline"
            builders={[builder]}
            class="flex w-{sortingId === defaultSort.id
              ? 'auto'
              : 'full'} justify-between gap-x-2 md:max-w-96 md:hover:bg-third"
            ><span
              >{sortSearchResults.find((s) => s.id === sortingId)?.readable ??
                defaultSort.readable}</span
            >
            {#if $open}
              <ChevronUp class="size-4" />
            {:else}
              <ChevronDown class="size-4" />
            {/if}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="min-w-[60vw] md:w-96 md:min-w-0">
          <DropdownMenu.RadioGroup bind:value={sortingId}>
            {#each sortSearchResults as sortOption}
              {#if sortOption.id !== defaultSort.id}
                <DropdownMenu.RadioItem
                  value={sortOption.id}
                  on:click={() => {
                    results = sortOption.onSelect(
                      results,
                      sortOption.ascending,
                    );
                  }}>{sortOption.readable}</DropdownMenu.RadioItem
                >
              {/if}
            {/each}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {#if ($selected && $selected.length > 0) || sortingId !== defaultSort.id || $formData.query}
        <Button
          variant="outline"
          class="ml-auto flex items-center gap-x-2 md:hover:bg-third"
          on:click={() => {
            resetForm();
          }}
          ><X class="size-4" />
          Rensa</Button
        >
      {/if}
    </div>
    {#if $selected && $selected.length > 0}
      <ul class="-mt-2 flex w-full flex-wrap gap-2">
        <li>
          <SearchSubjectButton
            ariaLabel="Rensa {$selected.length} teknologier"
            onClickCallback={() => ($selected = [])}
            text={$selected.length.toString()}
            class="border-2 border-third"
            textStyling="rounded-full bg-third px-3 py-1 text-background"
          >
            <X class="size-4" />
          </SearchSubjectButton>
        </li>
        {#each $selected as subject, i}
          <li>
            <SearchSubjectButton
              ariaLabel="Rensa {subject.label}"
              onClickCallback={() => {
                if ($selected)
                  $selected = $selected.filter((_, index) => index !== i);
              }}
              text={subject.value}
            >
              <X class="size-4" />
            </SearchSubjectButton>
          </li>
        {/each}
      </ul>
    {/if}

    {#if $open}
      <ul
        class="z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
        use:melt={$menu}
        transition:fly={{ duration: 150, y: -5 }}
      >
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          class="flex max-h-full flex-col gap-0 overflow-y-auto bg-card px-2 py-2 text-foreground"
          tabindex="0"
        >
          {#each filteredSubjects as subject, index (index)}
            <li
              use:melt={$option({
                value: subject.title,
                label: subject.title,
              })}
              class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
        data-[highlighted]:bg-third data-[highlighted]:text-background
          data-[disabled]:opacity-50"
            >
              {#if $isSelected(subject.title)}
                <div class="check absolute left-2 top-1/2 z-10 text-primary">
                  <Check class="size-4" />
                </div>
              {/if}
              <div class="pl-4">
                <span>{subject.title}</span>
              </div>
            </li>
          {:else}
            <li
              class="relative cursor-pointer rounded-md py-1 pl-8 pr-4
        data-[highlighted]:bg-third data-[highlighted]:text-background"
            >
              Inga resultat
            </li>
          {/each}
        </div>
      </ul>
    {/if}
  </div>
</section>
<Wavy class="-mt-4 overflow-x-hidden" />
<Container class="my-4 w-full px-8 md:my-6" minWidth maxWidth tag="main">
  {#if $message}
    <div class={messageStyling}>
      <FormMessage {message} scroll scrollTo="end" />
    </div>
  {:else if isInit && results.length > 0 && !$submitting}
    <SearchResultList {results} searchTerm={getSearchTerm()} />
  {:else if isInit && results.length === 0 && !$page.url.searchParams.get("q")}
    <!-- intentionally excluded !$formdata.subjects here because it can never be true with $!formdata.subjects (and subjects is reactive) -->
    <SearchSuggestion {setSuggestion} />
  {:else if initMessage && !$submitting}
    <div class={messageStyling}>
      <AlertMessage
        title={initMessage.title}
        description={initMessage.description}
        variant={initMessage.variant}
      />
    </div>
  {:else if results.length > 0}
    <SearchResultList {results} searchTerm={getSearchTerm()} />
  {:else}
    <div class="flex flex-col items-center gap-y-4 md:gap-y-6">
      <div class={messageStyling}>
        <AlertMessage
          title="Inga träffar på din sökning"
          description="Testa söka på en lärares namn, eller en annons titel, beskrivning eller pris."
        />
      </div>
      <SearchSuggestion {setSuggestion} />
    </div>
  {/if}
</Container>

<style lang="postcss">
  .check {
    @apply absolute left-2 top-1/2 text-primary;
    translate: 0 calc(-50% + 1px);
  }
</style>
