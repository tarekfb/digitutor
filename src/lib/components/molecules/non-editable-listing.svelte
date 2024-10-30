<script lang="ts">
  import type { Listing } from "$lib/shared/models/listing";
  import { languages } from "$lib/shared/models/common";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";

  export let listing: Listing;
  $: ({ title, description, subjects, hourly_price } = listing);
</script>

<div class="flex flex-col gap-y-4 generic-card">
  <div class="flex flex-col gap-y-4">
    <SecondaryTitle class="font-semibold">{title}</SecondaryTitle>
    <h2 class="text-xl">{hourly_price} SEK</h2>
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
          <p>{languages[subject].label}</p>
        </div>
      {/each}
    </div>
  </div>
</div>
