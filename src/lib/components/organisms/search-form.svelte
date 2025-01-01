<script lang="ts">
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import { Button } from "$lib/components/ui/button";
  import { Search, ChevronDown, Check, ChevronUp, X } from "lucide-svelte";
  import { searchSchema } from "src/lib/shared/models/search";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import type { Subject } from "src/lib/shared/models/subject";
  import { createCombobox, melt } from "@melt-ui/svelte";
  import { fly } from "svelte/transition";

  export let subjects: Subject[];

  export let form: SuperValidated<Infer<typeof searchSchema>>;
  const searchForm = superForm(form, {
    validators: zodClient(searchSchema),
    onSubmit() {
      $selected = [];
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

  export let formStyling: string = "";
  const subjectChipStyling =
    "h-12 hover:scale-105 transition-all ease-in-out inline-flex gap-x-2 items-center px-2 py-1 text-sm bg-background rounded-full md:hover:bg-background";
</script>

<form
  class="text-center flex flex-col gap-y-4 w-full {formStyling}"
  action="?/search"
  method="POST"
  use:enhance
>
  <div class="flex items-start min-w-72">
    <Form.Field form={searchForm} name="subjects" class="flex-auto w-20">
      <Form.Control let:attrs>
        <div class="flex flex-col gap-1">
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
              class="flex h-10 items-center w-full justify-between rounded-lg bg-card
          px-3 pr-6 rounded-r-none text-md placeholder:text-muted-foreground"
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
    <Form.Field form={searchForm} name="query" class="flex-none w-28 md:w-64">
      <Form.Control let:attrs>
        <div class="relative">
          <Input
            {...attrs}
            type="text"
            autocomplete="false"
            bind:value={$formData.query}
            placeholder="Sök på lärare"
            class="placeholder:text-muted-foreground text-md bg-card rounded-r-none rounded-l-none text-muted-foreground"
          />
        </div>
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Button
      type="submit"
      variant="accent-third"
      size="icon"
      disabled={$allErrors.length > 0 || $delayed}
      class="flex-none flex gap-x-2 items-center justify-center rounded-l-none"
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
  <ul class="flex flex-wrap gap-2 w-full">
    <li>
      <button
        aria-label="Rensa {$selected.length} teknologier"
        on:click={() => ($selected = [])}
        class="{subjectChipStyling} border-2 border-third"
      >
        <span class="bg-third text-background px-3 py-1 rounded-full"
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
        data-[highlighted]:bg-third/50 data-[highlighted]:text-primary
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
        data-[highlighted]:bg-third/50 data-[highlighted]:text-primary"
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
