<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { createListingSchema } from "$lib/shared/models/listing.js";
  import NonEditableListing from "$lib/components/molecules/non-editable-listing.svelte";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import EditableListing from "$lib/components/organisms/editable-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Pencil } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { PageData } from "./$types";
  import ReviewCard from "src/lib/components/molecules/review-card.svelte";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";
  import { websiteName } from "$lib/shared/constants/constants";

  export let data: PageData;
  $: ({ profile, listing, requestContactForm, startContactForm, reviews } =
    data);

  let isEditing = false;

  const listingForm = superForm(data.createListingForm, {
    validators: zodClient(createListingSchema),
    onUpdated({ form }) {
      if (form.valid) {
        isEditing = false;
        reset({ newState: data.createListingForm.data });
      }
    },
    resetForm: false,
  });

  const { reset } = listingForm;
</script>

<div class="flex flex-col gap-y-4 pb-8 w-full max-w-[1000px]">
  {#if listing.profile.is_active === false}
    <AlertMessage
      variant="destructive"
      title="Annonsen är borttagen."
      description="Läraren finns inte längre på {websiteName}. Annonsen är därför inte längre tillgänglig."
    />
    <Button on:click={() => goto("/")}>Gå hem</Button>
  {:else}
    <div class="flex gap-x-2 items-center">
      <Avatar
        profile={listing.profile}
        onClick={() => goto(`/profile/${listing.profile?.id}`)}
      />
      <PrimaryTitle>{listing.profile.first_name}</PrimaryTitle>
    </div>
    <SecondaryTitle>Annons</SecondaryTitle>
    {#if profile?.id === listing.profile.id}
      {#if isEditing}
        <EditableListing
          {listingForm}
          stopEditing={() => (isEditing = false)}
        />
      {:else}
        <NonEditableListing {listing} />
        <Button on:click={() => (isEditing = true)} class="self-end">
          <Pencil class="mr-2 h-4 w-4" />
          Ändra</Button
        >
      {/if}
    {:else}
      <NonEditableListing {listing} />
      {#if reviews.length !== 0}
        <SecondaryTitle>Recensioner</SecondaryTitle>
        {#each reviews as review}
          <ReviewCard {review} />
        {/each}
      {/if}
      <ContactTeacherForm
        {requestContactForm}
        {startContactForm}
        requestContactAction="?/requestContact"
        startContactAction="?/startContact"
        firstName={listing.profile.first_name}
        buttonStyling="self-end"
      />
    {/if}
  {/if}
</div>
