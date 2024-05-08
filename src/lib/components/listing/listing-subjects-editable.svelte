<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Subjects } from "src/lib/models/common.js";
  import { Plus } from "lucide-svelte";
  import { CircleMinus } from "lucide-svelte";
  import { tick } from "svelte";
  import { Check } from "lucide-svelte";
  import { ChevronsUpDown } from "lucide-svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Button } from "$lib/components/ui/button";

  const languages = [
    { label: "JavaScript", value: "1" },
    { label: "Python", value: "2" },
    { label: "Java", value: "3" },
    { label: "CSharp", value: "4" },
    { label: "CPlusPlus", value: "5" },
    { label: "Ruby", value: "6" },
    { label: "Swift", value: "7" },
    { label: "Go", value: "8" },
    { label: "PHP", value: "9" },
    { label: "TypeScript", value: "10" },
    { label: "HTML_CSS", value: "11" },
    { label: "ReactJS", value: "12" },
    { label: "AngularJS", value: "13" },
    { label: "VueJS", value: "14" },
    { label: "NodeJS", value: "15" },
    { label: "Django", value: "16" },
    { label: "Flask", value: "17" },
    { label: "Spring", value: "18" },
    { label: "dotNet", value: "19" },
    { label: "Laravel", value: "20" },
  ];

  export let isEditing;
  export let listingForm;
  export let formData;
  export let subjects: number[];
  export let removeSubject: (subjectId: number) => void;
  export let addSubject: (subjectId: number) => void;

  let value = "";
  let open = false;

  const placeholder = "Search subject...";

  $: selectedValue =
    languages.find((lang) => lang.value === value)?.label ?? placeholder;

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  const closeAndFocusTrigger = (triggerId: string) => {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  };
</script>

<div class="space-y-2">
  {#if subjects.length > 0}
    <div class="flex gap-2 items-center flex-wrap max-w-full">
      {#each subjects as subject}
        <div
          class="bg-slate-100 flex justify-between items-center gap-x-1 p-1 rounded-lg"
        >
          <p>{Subjects[subject]}</p>
          <Button
            variant="destructive"
            size="icon"
            on:click={() => removeSubject(subject)}><CircleMinus /></Button
          >
        </div>
      {/each}
    </div>
  {/if}

  {#if isEditing.subjects}
    <div class="flex justify-between items-center">
      <Popover.Root bind:open let:ids>
        <Popover.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            class="w-[200px] justify-between"
          >
            {selectedValue}
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input {placeholder} />
            <Command.Empty>No framework found.</Command.Empty>
            <Command.Group>
              {#each languages as language}
                <Command.Item
                  value={language.value}
                  onSelect={(currentValue) => {
                    value = currentValue;
                    closeAndFocusTrigger(ids.trigger);
                  }}
                >
                  <Check
                    class={cn(
                      "mr-2 h-4 w-4",
                      value !== language.value && "text-transparent",
                    )}
                  />
                  {language.label}
                </Command.Item>
              {/each}
            </Command.Group>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>

      <div class="flex justify-end gap-x-4 w-full">
        <Button
          type="button"
          variant="secondary"
          on:click={() => {
            isEditing.subjects = false;
          }}>Avbryt</Button
        >
        <Button
          role="submit"
          disabled={value === "" || value === placeholder}
          on:click={() => {
            isEditing.subjects = false;
            addSubject(parseInt(value));
          }}>Lägg till</Button
        >
      </div>
    </div>
  {:else}
    <Button size="icon" on:click={() => (isEditing.subjects = true)}
      ><Plus /></Button
    >
  {/if}
</div>
