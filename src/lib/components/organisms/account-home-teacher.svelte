<script lang="ts">
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import type { Listing } from "$lib/shared/models/listing";
  import CreateListing from "../atoms/create-listing.svelte";
  import ListingCard from "../molecules/listing-card.svelte";
  import type { Conversation } from "src/lib/shared/models/conversation";
  import ConversationCard from "../molecules/conversation-card.svelte";
  import type { Tables } from "src/supabase";
  import Link from "../atoms/link.svelte";

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
    <p class="text-center">Inga annonser. Testa skapa en!</p>
  {:else}
    {#each listings as listing}
        <ListingCard {listing} publicView={false} clickable />
    {/each}
  {/if}

  <CreateListing form={userForm} />
</div>

<PrimaryTitle class="text-center">Dina konversationer</PrimaryTitle>
<div class="flex flex-col items-center text-center gap-y-4 my-6">
  {#each conversations as conversation}
    <a
      href={"/account/conversation/" + conversation.id}
      aria-label="Gå till konversation"
      class="w-full"
      ><ConversationCard {conversation} {profile} />
    </a>
  {:else}
    <p class="text-lg">Inga konversationer ännu.</p>
    <p>
      Se våra <Link href="/tips">tips</Link> för att förbättra dina chanser att bli
      kontaktad.
    </p>
  {/each}
</div>
