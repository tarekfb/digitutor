<script lang="ts">
  import MissingListing from "$lib/components/organisms/missing-listing.svelte";
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
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";

  export let data;
  $: ({ profile, listing, requestContactForm, startContactForm } = data);
  let isEditing = false;
  let isAuthor = false;
  $: if (profile && listing && listing.profile)
    isAuthor = profile.id === listing.profile.id;

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

  const {
    form: formData,
    enhance,
    errors,
    submitting,
    allErrors,
    message,
    reset,
  } = listingForm;
</script>

<div class="flex flex-col gap-y-4 pb-8 w-full">
  {#if !listing}
    <MissingListing />
  {:else if isAuthor}
    <div class="flex justify-between gap-x-2 items-center">
      <PrimaryTitle>{listing.profile.first_name}</PrimaryTitle>
      <Avatar
        profile={listing.profile}
        onClick={() => goto(`/profile/${listing.profile?.id}`)}
      />
    </div>
    {#if isEditing}
      <EditableListing
        {formData}
        {enhance}
        {submitting}
        {message}
        {errors}
        {listingForm}
        {allErrors}
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
    <div class="flex justify-between gap-x-2 items-center">
      <PrimaryTitle>{listing.profile.first_name}</PrimaryTitle>
      <Avatar
        profile={listing.profile}
        onClick={() => goto(`/profile/${listing.profile?.id}`)}
      />
    </div>
    <NonEditableListing {listing} />
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
