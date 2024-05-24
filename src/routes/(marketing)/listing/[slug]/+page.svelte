<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "$lib/components/listing/delete-listing.svelte";
  import MissingListing from "$lib/components/listing/missing-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { createListingSchema } from "$lib/models/listing";
  import DescriptionEditable from "src/lib/components/listing/description-editable.svelte";
  import TitleEditable from "src/lib/components/listing/title-editable.svelte";
  import SubjectsEditable from "src/lib/components/listing/subjects-editable.svelte";
  import HourlyPriceEditable from "src/lib/components/listing/hourly-price-editable.svelte";
  import NonEditableListing from "src/lib/components/listing/non-editable-listing.svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import VisibilityEditable from "src/lib/components/listing/visibility-editable.svelte";
  import { SaveIcon, X, Pencil } from "lucide-svelte";
  import { convertToInitials } from "src/lib/utils.js";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { startConversationSchema } from "src/lib/models/conversations.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";

  export let data;
  const { listing, profile, createListingForm, startConversationForm } = data;

  let isEditing = false;
  let isAuthor = false;
  if (profile && listing && listing.profile)
    isAuthor = profile.id === listing.profile.id;

  const listingForm = superForm(createListingForm, {
    validators: zodClient(createListingSchema),
  });

  const contactForm = superForm(startConversationForm, {
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
      <div class="flex flex-col gap-y-4 m-8">
        <FormMessage {message} scroll />
        <form
          method="POST"
          use:enhance
          action="?/updateListing"
          class="flex flex-col gap-y-4 generic-card"
        >
          <TitleEditable {formData} {listingForm} />
          <HourlyPriceEditable {formData} {listingForm} />
          <Separator />
          <DescriptionEditable {formData} {listingForm} />
          <SubjectsEditable {formData} {errors} />
          <VisibilityEditable {formData} {listingForm} />

          <div class="flex justify-end gap-x-2">
            <Button on:click={() => (isEditing = false)} variant="secondary">
              <X class="mr-2 h-5 w-5" />
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={$allErrors.length > 0 || $submitting}
            >
              {#if $submitting}
                <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
              {:else}
                <SaveIcon class="mr-2 h-5 w-5" />
                Spara
              {/if}
            </Button>
          </div>
          <div class="self-start">
            <DeleteListing />
          </div>
        </form>
      </div>
    {:else}
      <div class="flex flex-col gap-y-4 generic-card m-8">
        <NonEditableListing {listing} />
        {#if listing.visible}
          <div
            class="bg-green-300 p-2 rounded-lg self-start border-black border-solid border"
          >
            Publicerad
          </div>
        {:else}
          <div
            class="bg-slate-100 p-2 rounded-lg self-start border-black border-solid border"
          >
            Ej publicerad
          </div>
        {/if}
        <Button on:click={() => (isEditing = true)} class="self-end">
          <Pencil class="mr-2 h-4 w-4" />
          Ändra</Button
        >
      </div>
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
      <NonEditableListing {listing} />
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
