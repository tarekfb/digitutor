<script lang="ts">
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Search from "lucide-svelte/icons/search";
  import Check from "lucide-svelte/icons/check";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import ChevronUp from "lucide-svelte/icons/chevron-up";
  import X from "lucide-svelte/icons/x";
  import { searchSchema } from "src/lib/shared/models/search.ts";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import type { Subject } from "src/lib/shared/models/subject.ts";
  import { createCombobox, melt } from "@melt-ui/svelte";
  import { fly } from "svelte/transition";
  import type { ActionResult } from "@sveltejs/kit";
  import { goto } from "$app/navigation";

  export let formStyling: string = "";
  export let subjects: Subject[];
  export let form: SuperValidated<Infer<typeof searchSchema>>;
  export let onUpdatedCallback:
    | ((
        form: SuperValidated<Infer<typeof searchSchema>>,
        result: Required<
          Extract<
            ActionResult,
            {
              type: "success" | "failure";
            }
          >
        >,
      ) => void)
    | undefined = undefined;

  const searchForm = superForm(form, {
    validators: zodClient(searchSchema),
    onSubmit() {
      $selected = [];
    },
    onUpdate({ form, result }) {
      if (onUpdatedCallback) onUpdatedCallback(form, result);
    },
  });
  const { form: formData, enhance, delayed, message, allErrors } = searchForm;

  const {
    elements: { menu, input, option, label, hiddenInput },
    states: { open, inputValue, touchedInput, selected },
    helpers: { isSelected },
  } = createCombobox<string, true>({
    forceVisible: true,
    multiple: true,
    onSelectedChange: ({ next }) => {
      if (next && next[0] && next[next.length - 1].value === "all") {
        goto("/search?getAll=true");
        // this removal of the "all" element from being pushed to the next array while goto is loading async operation
        const seeAllIndex = next.find((element) => element.value === "all");
        if (seeAllIndex) next.splice(next.indexOf(seeAllIndex), 1);
      }
      if (next && next[0] && next[0].value)
        $formData.subjects = next.map((element) => element.value).join(" ");
      else $formData.subjects = "";
      return next;
    },
  });

  $: filteredSubjects = $touchedInput
    ? subjects.filter(({ title, altTitle }) => {
        const normalizedInput = $inputValue.toLowerCase();
        return (
          title.toLowerCase().includes(normalizedInput) ||
          altTitle?.toLowerCase().includes(normalizedInput)
        );
      })
    : subjects;

  const subjectChipStyling =
    "h-12 grow inline-flex gap-x-2 items-center px-2 py-1 text-sm bg-background rounded-full md:hover:bg-background bg-card";

  const languageItemStyling =
    "relative cursor-pointer rounded-md pl-4 data-[highlighted]:bg-third/75 data-[highlighted]:text-background data-[disabled]:opacity-50";
</script>

<form
  class="flex w-full flex-col gap-y-4 text-center {formStyling}"
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

          <div
            class="relative rounded-r-none bg-card md:flex md:items-center md:rounded-l-sm"
          >
            {#if $selected && $selected.length > 0}
              <button
                type="button"
                aria-label="Rensa {$selected.length} teknologier"
                on:click={() => ($selected = [])}
                class="border-r-1 m-0 hidden px-2 md:inline-flex md:items-center md:gap-x-1"
                ><span class="rounded-full bg-third px-2 text-background"
                  >{$selected.length}</span
                >
                <X /></button
              >
            {/if}
            <input
              use:melt={$input}
              class="text-md flex h-10 w-full items-center justify-between rounded-lg rounded-r-none
            px-3 pr-6 placeholder:text-muted-foreground {$selected &&
              $selected.length > 0
                ? 'rounded-l-none border-l border-solid border-input'
                : ''}"
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
    <Form.Field form={searchForm} name="query" class="w-28 flex-none md:w-64">
      <Form.Control let:attrs>
        <div class="relative">
          <Input
            {...attrs}
            type="text"
            autocomplete="false"
            bind:value={$formData.query}
            placeholder="Sök lärare"
            class="text-md rounded-l-none rounded-r-none bg-card text-muted-foreground placeholder:text-muted-foreground"
          />
        </div>
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Button
      type="submit"
      variant="third-secondary"
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
<FormMessage {message} scroll scrollTo="end" />
{#if $selected && $selected.length > 0}
  <ul class="flex w-full flex-wrap gap-2 md:hidden">
    <li>
      <button
        aria-label="Rensa {$selected.length} teknologier"
        on:click={() => ($selected = [])}
        class="{subjectChipStyling} border-2 border-third bg-card"
      >
        <span class="rounded-full bg-third px-3 py-1 text-background"
          >{$selected.length}</span
        >
        <X class="size-4" />
      </button>
    </li>
    {#each $selected as subject, i}
      <li>
        <button
          on:click={() => {
            if ($selected)
              $selected = $selected.filter((_, index) => index !== i);
          }}
          aria-label="Rensa {subject.label}"
          class={subjectChipStyling}
        >
          {subject.label}
          <X class="size-4" />
        </button>
      </li>
    {/each}
  </ul>
{/if}

{#if $open}
  <ul
    class="z-40 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
    use:melt={$menu}
    transition:fly={{ duration: 150, y: -5 }}
  >
    <!-- z-40 to match navbar -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="flex max-h-full flex-col gap-0 overflow-y-auto bg-card px-2 py-2 text-foreground"
      tabindex="0"
    >
      <li
        class="{languageItemStyling} py-2 pl-8 text-third data-[highlighted]:bg-accent"
        use:melt={$option({
          value: "all",
          label: "Alla",
        })}
      >
        Se alla lärare
      </li>

      {#each filteredSubjects as subject, index (index)}
        <li
          use:melt={$option({
            value: subject.title,
            label: subject.title,
          })}
          class="scroll-my-2 py-2 {languageItemStyling}"
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
          class="py-1 pl-8
        {languageItemStyling}"
        >
          Inga resultat
        </li>
      {/each}
    </div>
  </ul>
{/if}

<style lang="postcss">
  .check {
    @apply absolute left-2 top-1/2 text-primary;
    translate: 0 calc(-50% + 1px);
  }
</style>
