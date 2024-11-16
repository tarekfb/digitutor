<script lang="ts">
  import type { PageData } from "./$types";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import CreateListing from "$lib/components/atoms/create-listing.svelte";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import type { Listing } from "$lib/shared/models/listing";
  import { initCreateListingSchema } from "$lib/shared/models/listing.js";
  import {
    superForm,
    type SuperValidated,
    type Infer,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import RootContainer from "src/lib/components/molecules/root-container.svelte";
  import AccountLayout from "../account-layout.svelte";

  export let data: PageData;
  const listings = data.listings as Listing[];

  const form = data.form as SuperValidated<
    Infer<typeof initCreateListingSchema>
  >;
  // this is complaining about potential undefined. Maybe there's an issue with +page.server.ts?
  // anyway, proceeding with this dirty hack...

  const userForm = superForm(form, {
    validators: zodClient(initCreateListingSchema),
  });
</script>

<AccountLayout>
  <PrimaryTitle class="text-center">Dina annonser</PrimaryTitle>
  <RootContainer class="my-6 w-full">
    {#each listings as listing}
      <ListingCard {listing} publicView={false} />
    {:else}
      <p class="text-center">Inga annonser. Testa skapa en!</p>
    {/each}
    <CreateListing form={userForm} />
  </RootContainer>
</AccountLayout>
