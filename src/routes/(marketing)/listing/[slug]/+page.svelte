<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { updateListingSchema } from "$lib/shared/models/listing.js";
  import NonEditableListing from "$lib/components/molecules/non-editable-listing.svelte";
  import EditableListing from "$lib/components/organisms/editable-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Pencil } from "lucide-svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { PageData } from "./$types";
  import ReviewCard from "src/lib/components/molecules/review-card.svelte";
  import AvatarNameBar from "src/lib/components/organisms/avatar-name-bar.svelte";

  export let data: PageData;
  $: ({ profile, listing, requestContactForm, startContactForm, reviews } =
    data);

  let isEditing = false;

  const listingForm = superForm(data.updateListingForm, {
    validators: zodClient(updateListingSchema),
    onUpdated({ form }) {
      if (form.valid) {
        isEditing = false;
        reset({ newState: data.updateListingForm.data });
      }
    },
    resetForm: false,
  });

  const { reset } = listingForm;
</script>

<div class="flex flex-col gap-y-4 pb-8 w-full max-w-[1000px]">
  <AvatarNameBar clickable profile={listing.profile}>
    <PrimaryTitle>{listing.profile.first_name}</PrimaryTitle>
  </AvatarNameBar>
  <SecondaryTitle>Annons</SecondaryTitle>
  {#if profile?.id === listing.profile.id}
    {#if isEditing}
      <EditableListing {listingForm} stopEditing={() => (isEditing = false)} />
    {:else}
      <NonEditableListing {listing} />
      <Button on:click={() => (isEditing = true)} class="self-end">
        <Pencil class="mr-2 h-4 w-4" />
        Ändra</Button
      >
    {/if}
    <SecondaryTitle>Recensioner</SecondaryTitle>
    {#each reviews as review}
      <ReviewCard {review} />
    {:else}
      <p>{listing.profile.first_name} har inga recensioner ännu.</p>
    {/each}
  {:else}
    <NonEditableListing {listing} />
    <SecondaryTitle>Recensioner</SecondaryTitle>
    {#each reviews as review}
      <ReviewCard {review} />
    {:else}
      <p>{listing.profile.first_name} har inga recensioner ännu.</p>
    {/each}
    <ContactTeacherForm
      {requestContactForm}
      {startContactForm}
      requestContactAction="?/requestContact"
      startContactAction="?/startContact"
      firstName={listing.profile.first_name}
      buttonStyling="self-end"
    />
  {/if}
</div>
