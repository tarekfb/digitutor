<script lang="ts">
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import type { Listing } from "src/lib/shared/models/listing";
  import CreateListing from "../atoms/create-listing.svelte";
  import ListingCard from "../molecules/listing-card.svelte";
  import type { Conversation } from "src/lib/shared/models/conversations";
  import ConversationCard from "../molecules/conversation-card.svelte";
  import type { Tables } from "src/supabase";

  export let conversations: Conversation[];
  export let listings: Listing[] | undefined;
  export let userForm;
  export let profile: Tables<"profiles">;
</script>

<PrimaryTitle class="text-center">Dina annonser</PrimaryTitle>
<div class="flex flex-col gap-y-4 my-6">
  {#if !listings}
    <p>Kunde inte hämta annonser.</p>
  {:else if listings.length === 0}
    <p>Inga annonser. Testa skapa en!</p>
  {:else}
    {#each listings as listing}
      <a href="/listing/{listing.id}" aria-label="Navigate to ad">
        <ListingCard {listing} />
      </a>
    {/each}
  {/if}

  <CreateListing form={userForm} />
</div>

<PrimaryTitle class="text-center">Dina konversationer</PrimaryTitle>
<div class="flex flex-col items-center gap-y-4 my-6">
  {#each conversations as conversation}
    <a
      href={"/account/conversation/" + conversation.id}
      aria-label="Navigate to ad"
      class="w-full"
      ><ConversationCard {conversation} {profile} />
    </a>
  {:else}
    <p>Inga konversationer. Testa söka efter en lärare!</p>
  {/each}
</div>
