<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import * as Dialog from "$lib/components/ui/dialog";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { initCreateListingSchema } from "src/lib/shared/models/listing.js";
  import StudentAccount from "src/lib/components/organisms/student-account.svelte";
  import * as Form from "$lib/components/ui/form";
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import { mediaQuery } from "svelte-legos";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import Label from "src/lib/components/atoms/label.svelte";
  import CreateListing from "src/lib/components/atoms/create-listing.svelte";

  let open = false;
  const isDesktop = mediaQuery("(min-width: 768px)");

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");

  export let data;
  $: ({ listings, conversations } = data);

  const form = data.form as SuperValidated<
    {
      title: string;
    },
    any,
    {
      title: string;
    }
  >;
  // this is complaining about potential undefined. Maybe there's an issue with parent serving data?
  // anyway, proceeding with this dirty hack...

  const userForm = superForm(form, {
    validators: zodClient(initCreateListingSchema),
  });
</script>

<svelte:head>
  <title>Konto</title>
</svelte:head>

{#if data.profile.role === "teacher"}
  <PrimaryTitle>Dina annonser</PrimaryTitle>

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
{:else}
  <StudentAccount {conversations} />
{/if}
