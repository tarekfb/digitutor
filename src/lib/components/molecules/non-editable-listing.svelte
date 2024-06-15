<script lang="ts">
  import type { Listing } from "src/lib/shared/models/listing";
  import { Subjects } from "src/lib/shared/models/common";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";

  export let listing: Listing;
  const { title, description, subjects, hourlyPrice, visible } = listing;
</script>

<div class="flex flex-col gap-y-4 generic-card">
  <div class="flex flex-col gap-y-4">
    <SecondaryTitle class="font-semibold">{title}</SecondaryTitle>
    <h2 class="text-xl">{hourlyPrice} SEK</h2>
    {#if description}
      <p>{description}</p>
    {:else}
      <p>Den här annonsen har ingen beskrivning just nu.</p>
    {/if}
    <div class="flex gap-2 items-center flex-wrap max-w-full">
      {#each subjects as subject}
        <div
          class="bg-slate-100 flex justify-between items-center gap-x-1 p-1 rounded-lg"
        >
          <p>{Subjects[subject]}</p>
        </div>
      {/each}
    </div>
  </div>
  {#if visible}
    <div
      class="bg-green-300 p-2 rounded-lg self-start border-black border-solid border"
    >
      Publicerad
    </div>
  {:else}
    <div
      class="bg-slate-100 p-2 rounded-lg self-start border-black border-solid border"
    >
      Ej publicerad
    </div>
  {/if}
</div>
