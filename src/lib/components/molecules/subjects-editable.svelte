<script lang="ts">
  import type { Subject } from "src/lib/shared/models/subject";

  export let formData;
  export let errors;
  export let subjects: Subject[] = [];
</script>

<div
  class="flex gap-2 items-center flex-wrap max-w-full border rounded-sm p-5 bg-card"
  data-testid="editable-subjects"
>
  {#each subjects as subject}
    <label class="bg-background p-2 rounded-sm">
      <input
        type="checkbox"
        bind:group={$formData.subjects}
        name="subjects"
        value={subject.id}
      />
      {subject.title}
    </label>
  {/each}
</div>
{#if $errors.subjects?._errors}
  <p class="text-red-600 font-semibold text-sm">
    {$errors.subjects._errors}
  </p>
{/if}
