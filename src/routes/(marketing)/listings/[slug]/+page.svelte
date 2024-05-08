<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "src/lib/components/listing/delete-listing.svelte";
  import MissingListing from "src/lib/components/listing/missing-listing.svelte";
  import ListingDescription from "src/lib/components/listing/listing-description.svelte";
  import type { User } from "@supabase/supabase-js";
  import { Button } from "$lib/components/ui/button";

  export let data;
  const listing = data.listing;
  const user: User | undefined = data.user;
  const form = data.form;
  let isEditingDescription = false;
  let isAuthor = false;
  if (user && listing && listing.profile)
    isAuthor = user.id === listing.profile.id;
</script>

<div class="p-8 space-y-2">
  {#if !listing}
    <MissingListing />
  {:else}
    <div class="flex justify-between items-center">
      <h1 class="text-3xl">{listing.title}</h1>
      {#if isAuthor}
        <DeleteListing />
      {/if}
    </div>
    <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
    <Separator class="my-4" />
    <div>
      {#if listing.description}
        <p>{listing.description}</p>
      {:else}
        <div class="flex justify-center gap-x-2">
          {#if !isEditingDescription}
            <p>Den här annonsen har ingen beskrivning just nu.</p>
          {/if}
          {#if isAuthor && !isEditingDescription}
            <Button on:click={() => (isEditingDescription = true)}>Ändra</Button
            >
          {/if}
        </div>
        {#if isAuthor && isEditingDescription}
          <ListingDescription {form} {isEditingDescription} />
        {/if}
        <!-- <Button variant="secondary">Lägg till en beskrivning</Button> -->
      {/if}
    </div>
  {/if}
</div>
