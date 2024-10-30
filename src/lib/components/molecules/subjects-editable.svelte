<script lang="ts">
  import { languages } from "$lib/shared/models/common";

  export let formData;
  export let errors;
</script>

<div
  class="flex gap-2 items-center flex-wrap max-w-full border rounded-sm p-5 bg-card"
  data-testid="editable-subjects"
>
  {#each languages as language}
    <label class="bg-background p-2 rounded-sm">
      <input
        type="checkbox"
        bind:group={$formData.subjects}
        name="subjects"
        value={language.id}
      />
      {language.label}
    </label>
  {/each}
</div>
{#if $errors.subjects?._errors}
  <p class="text-red-600 font-semibold text-sm">
    {$errors.subjects._errors}
  </p>
{/if}
