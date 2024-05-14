<script lang="ts">
  import { websiteName } from "$lib/constants";
  import type { Listing } from "$lib/models/listing";
  import ListingCard from "$lib/components/listing/listing-card.svelte";

  export let data;
  const listings: Listing[] | null = data.listings;
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} Home Page" />
</svelte:head>

<div class="hero min-h-[40vh]">
  <div class="hero-content text-center py-12">
    <div class="max-w-xl">
      <div
        class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4 md:mb-8"
      >
        Mindic
      </div>

      <div
        class="text-4xl md:text-6xl font-bold px-2"
        style="line-height: 1.2;"
      >
        Den
        <span
          class="underline decoration-accent decoration-4 md:decoration-[6px]"
          >största</span
        >,
        <span
          class="underline decoration-accent decoration-4 md:decoration-[6px]"
          >bästa</span
        >, och
        <span
          class="underline decoration-accent decoration-4 md:decoration-[6px]"
          >vackraste</span
        >
        <span> plattformen för privatundervisning i programmering</span>
      </div>
    </div>
  </div>
</div>
<div class="min-h-[60vh]">
  <div class="pt-20 pb-8 px-7">
    <div class="max-w-lg mx-auto text-center">
      <div
        class="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
      >
        Spana in våra lärare
      </div>
      <div class="mt-6 text-xl font-bold">
        Hör av dig och
        <span
          class="underline decoration-accent decoration-[3px] md:decoration-[4px]"
        >
          uppgradera dina skills idag
        </span>
      </div>
    </div>
    {#if listings && listings.length > 0}
      <div class="flex flex-col gap-y-4 mt-12">
        {#each listings as listing}
          <a href="/listings/{listing.id}" aria-label="Navigate to ad">
            <ListingCard {listing} />
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
