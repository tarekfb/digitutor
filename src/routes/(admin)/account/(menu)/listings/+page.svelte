<script lang="ts">
  import type { PageData } from "./$types.ts";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import CreateListing from "$lib/components/atoms/create-listing.svelte";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import { initCreateListingSchema } from "$lib/shared/models/listing.js";
  import {
    superForm,
    type SuperValidated,
    type Infer,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import Container from "src/lib/components/templates/container.svelte";
  import AccountLayout from "src/lib/components/templates/account-layout.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.ts";

  export let data: PageData;
  $: ({ listings } = data);

  const form = data.form as SuperValidated<
    Infer<typeof initCreateListingSchema>
  >;
  // this is complaining about potential undefined. Maybe there's an issue with +page.server.ts?
  // anyway, proceeding with this dirty hack...

  const userForm = superForm(form, {
    validators: zodClient(initCreateListingSchema),
  });
</script>

<svelte:head>
  <title>{websiteName} | Annonser</title>
</svelte:head>

<AccountLayout>
  <PrimaryTitle class="text-center" responsiveMb>Dina annonser</PrimaryTitle>
  <Container class="w-full" minWidth maxWidth padding>
    {#each listings as listing}
      <ListingCard {listing} publicView={false} />
    {:else}
      <p class="text-center">Inga annonser. Testa skapa en!</p>
    {/each}
    <CreateListing form={userForm} />
  </Container>
</AccountLayout>
