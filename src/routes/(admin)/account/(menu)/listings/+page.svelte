<script lang="ts">
  import type { PageData } from "./$types";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import CreateListing from "$lib/components/atoms/create-listing.svelte";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import type { Listing } from "$lib/shared/models/listing";
  import { initCreateListingSchema } from "$lib/shared/models/listing.js";
  import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data: PageData;
  const listings = data.listings as Listing[];

  const form = data.form as SuperValidated<Infer<typeof initCreateListingSchema>>;
  // this is complaining about potential undefined. Maybe there's an issue with parent serving data?
  // anyway, proceeding with this dirty hack...

  const userForm = superForm(form, {
    validators: zodClient(initCreateListingSchema),
  });
</script>

<PrimaryTitle class="text-center">Dina annonser</PrimaryTitle>
<div class="flex flex-col gap-y-4 my-6 w-full">
  {#each listings as listing}
    <ListingCard {listing} publicView={false} clickable />
  {:else}
    <p class="text-center">Inga annonser. Testa skapa en!</p>
  {/each}
  <CreateListing form={userForm} />
</div>
