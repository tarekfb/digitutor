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

  export let data;
  const { listing, profile, form } = data;

  let isEditing = false;
  let isAuthor = false;
  if (profile && listing && listing.profile)
    isAuthor = profile.id === listing.profile.id;

  const listingForm = superForm(form, {
    validators: zodClient(createListingSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Uppdaterat annonsen.`);
        isEditing = false;
      } else {
        toast.error("Fixa felen i formuläret.");
      }
    },
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, errors, submitting, allErrors} = listingForm;
</script>

<div class="flex flex-col gap-y-2">
  {#if !listing}
    <MissingListing />
  {:else if isAuthor}
    {#if isEditing}
      <form
        method="POST"
        use:enhance
        action="?/updateListing"
        class="flex flex-col gap-y-4 generic-card m-8"
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
            disabled={$allErrors.length > 0 ||
              $submitting}
          >
            {#if $submitting}
              <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
            {:else}
              <SaveIcon class="mr-2 h-5 w-5" />
              Spara
            {/if}
          </Button>
        </div>
      </form>
      <div class="self-end mx-8 mb-8">
        <DeleteListing />
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
    <div class="generic-card m-8 flex flex-col">
      <NonEditableListing {listing} />
    </div>
    <Button class="mx-8"
      >Kontakta {listing.profile?.first_name ?? "läraren"}</Button
    >
  {/if}
</div>
