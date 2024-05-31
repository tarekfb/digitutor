<script lang="ts">
  import MissingListing from "src/lib/components/organisms/missing-listing.svelte";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { createListingSchema } from "$lib/models/listing";
  import NonEditableListing from "src/lib/components/molecules/non-editable-listing.svelte";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  import { contactSchema } from "src/lib/models/conversations.js";
  import EditableListing from "src/lib/components/organisms/editable-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Pencil } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import ContactTeacherForm from "src/lib/components/molecules/contact-teacher-form.svelte";

  export let data;
  $: ({ profile, listing } = data);
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

  const contactForm = superForm(data.contactForm, {
    validators: zodClient(contactSchema),
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

<div class="flex flex-col gap-y-4 pb-8">
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
      <Button on:click={() => (isEditing = true)} class="self-end mx-8">
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
      form={contactForm}
      action="?/contact"
      firstName={listing.profile.first_name}
      buttonStyling="self-end"
    />
  {/if}
</div>
