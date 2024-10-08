<script lang="ts">
  import { Subjects, languages } from "$lib/shared/models/common";

  export let formData;
  export let errors;
</script>

<div
  class="flex gap-2 items-center flex-wrap max-w-full border rounded-lg p-2 bg-background"
  data-testid="editable-subjects"
>
  {#each languages as subject}
    <label class="bg-card p-2 rounded-lg">
      <input
        type="checkbox"
        bind:group={$formData.subjects}
        name="subjects"
        value={subject.id}
      />
      {Subjects[Number(subject.id)]}
    </label>
  {/each}
</div>
{#if $errors.subjects?._errors}
  <p class="text-red-600 font-semibold text-sm">
    {$errors.subjects._errors}
  </p>
{/if}
