<script lang="ts">
  import { websiteName } from "$lib/shared/constants/constants";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";

  export let data;
</script>

<svelte:head>
  <title>{websiteName}</title>
  <meta name="description" content="{websiteName} Home Page" />
</svelte:head>

<div class="flex flex-col items-center gap-y-4 text-center py-12 md:gap-y-8">
  <div class="max-w-xl">
    <div
      class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
    >
      Mindic
    </div>

    <div class="text-4xl md:text-6xl font-bold px-2" style="line-height: 1.2;">
      Den
      <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
        >största</span
      >,
      <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
        >bästa</span
      >, och
      <span class="underline decoration-accent decoration-4 md:decoration-[6px]"
        >vackraste</span
      >
      <span> placeholdern för blabla</span>
    </div>
  </div>
  {#if !data.session}
    <Button on:click={() => goto("/auth/sign-up")}>Skapa konto</Button>
  {/if}
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

    <div class="flex flex-col gap-y-4 mt-12">
      {#each data.listings as listing}
        <a href="/listing/{listing.id}" aria-label="Navigate to ad">
          <ListingCard {listing} />
        </a>
      {:else}
        <p>Det finns inga annonser ännu.</p>
      {/each}
    </div>
  </div>
</div>
