<script lang="ts">
  import type { Listing } from "src/lib/models/listing";
  import { Subjects } from "src/lib/models/common";

  export let listing: Listing;
</script>

<div class="flex flex-col gap-y-4">
  <h1 class="text-3xl">{listing.title}</h1>
  <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
  {#if listing.description}
    <p>{listing.description}</p>
  {:else}
    <p>Den här annonsen har ingen beskrivning just nu.</p>
  {/if}
  <div class="flex gap-2 items-center flex-wrap max-w-full">
    {#each listing.subjects as subject}
      <div
        class="bg-slate-100 flex justify-between items-center gap-x-1 p-1 rounded-lg"
      >
        <p>{Subjects[subject]}</p>
      </div>
    {/each}
  </div>
</div>
