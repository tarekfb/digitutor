<script lang="ts">
  import type { PageData } from "./$types";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import CreateListing from "$lib/components/atoms/create-listing.svelte";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import {
    superForm,
    type SuperValidated,
    type Infer,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import AccountLayout from "src/lib/components/templates/account-layout.svelte";
  import { passwordResetSchema } from "src/lib/shared/models/user";

  export let data: PageData;

  const userForm = superForm(data.form, {
    validators: zodClient(passwordResetSchema),
  });
</script>

<AccountLayout>
  <PrimaryTitle class="text-center">Dina annonser</PrimaryTitle>
  <RootContainer class="my-6 w-full"></RootContainer>
</AccountLayout>
