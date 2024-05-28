<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "src/lib/components/molecules/delete-listing.svelte";
  import MissingListing from "src/lib/components/organisms/missing-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { createListingSchema } from "$lib/models/listing";
  import DescriptionEditable from "src/lib/components/molecules/description-editable.svelte";
  import TitleEditable from "src/lib/components/molecules/title-editable.svelte";
  import SubjectsEditable from "src/lib/components/molecules/subjects-editable.svelte";
  import HourlyPriceEditable from "src/lib/components/molecules/hourly-price-editable.svelte";
  import NonEditableListing from "src/lib/components/molecules/non-editable-listing.svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import VisibilityEditable from "src/lib/components/molecules/visibility-editable.svelte";
  import { SaveIcon, X, Pencil } from "lucide-svelte";
  import { convertToInitials } from "src/lib/utils.js";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { startConversationSchema } from "src/lib/models/conversations.js";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import EditableListing from "src/lib/components/organisms/editable-listing.svelte";

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
      }
    },
    resetForm: true,
  });

  const contactForm = superForm(data.startConversationForm, {
    validators: zodClient(startConversationSchema),
  });

  const {
    form: formData,
    enhance,
    errors,
    submitting,
    allErrors,
    message,
  } = listingForm;

  const {
    form: contactFormData,
    enhance: enhanceContactForm,
    submitting: contactFormSubmitting,
    allErrors: contactAllErrors,
    message: contactMessage,
  } = contactForm;
</script>

<div class="flex flex-col gap-y-4 pb-8">
  {#if !listing}
    <MissingListing />
  {:else if isAuthor}
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
      <NonEditableListing {listing} startEditing={() => (isEditing = true)} />
    {/if}
  {:else}
    <div class="flex justify-between gap-x-2 mx-8 mt-8 items-center">
      <h1 class="text-3xl md:text-4xl">
        {listing.profile?.first_name ?? "Saknar namn..."}
      </h1>
      <Avatar.Root class="h-8 w-8 flex justify-center text-xs items-center">
        <Avatar.Fallback class="bg-accent text-background"
          >{convertToInitials(
            listing.profile?.first_name ?? "?",
            listing.profile?.last_name ?? "?",
          )}</Avatar.Fallback
        >
      </Avatar.Root>
    </div>
    <div class="generic-card mx-8 flex flex-col">
      <NonEditableListing {listing} startEditing={() => (isEditing = true)} />
    </div>
    <form
      method="POST"
      use:enhanceContactForm
      action="?/contact"
      class="flex flex-col gap-y-4 mx-8"
    >
      <input type="hidden" name="teacher" value={$contactFormData.teacher} />
      <FormSubmit
        submitting={contactFormSubmitting}
        allErrors={contactAllErrors}
        text="Kontakta {listing.profile?.first_name ?? 'läraren'}"
      />
      <FormMessage message={contactMessage} scroll />
    </form>
  {/if}
</div>
