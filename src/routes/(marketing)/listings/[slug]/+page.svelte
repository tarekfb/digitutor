<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "$lib/components/listing/delete-listing.svelte";
  import MissingListing from "$lib/components/listing/missing-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { listingSchema } from "$lib/models/listing";
  import DescriptionEditable from "src/lib/components/listing/description-editable.svelte";
  import TitleEditable from "src/lib/components/listing/title-editable.svelte";
  import SubjectsEditable from "src/lib/components/listing/subjects-editable.svelte";
  import HourlyPriceEditable from "src/lib/components/listing/hourly-price-editable.svelte";
  import NonEditableListing from "src/lib/components/listing/non-editable-listing.svelte";

  export let data;
  const { listing, user, form } = data;

  let isEditing = false;
  let isAuthor = false;
  if (user && listing && listing.profile)
    isAuthor = user.id === listing.profile.id;

  const listingForm = superForm(form, {
    validators: zodClient(listingSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(
          `Uppdaterat annonsen: ${JSON.stringify(f.data, null, 2)}`,
        );
      } else {
        toast.error("Fixa felen i formuläret.");
      }
    },
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, errors, message } = listingForm;
</script>

<div class="p-8 space-y-2">
  {#if !listing}
    <MissingListing />
  {:else if isAuthor}
    {#if isEditing}
      <form
        method="POST"
        use:enhance
        action="?/updateListing"
        class="flex flex-col gap-y-4"
      >
        {#if $message}
          <div class="text-3xl">{$message}</div>
        {/if}
        <TitleEditable {formData} {listingForm} />
        <HourlyPriceEditable {formData} {listingForm} />
        <Separator />
        <DescriptionEditable {formData} {listingForm} />
        <SubjectsEditable {formData} {errors} />

        <Button
          type="submit"
          disabled={$errors._errors && $errors._errors.length > 0}>Spara</Button
        >
        <SuperDebug data={$formData} />
      </form>
      <DeleteListing />
    {:else}
      <NonEditableListing {listing} />
      <Button on:click={() => (isEditing = true)}>Ändra</Button>
    {/if}
    <Button on:click={() => (isEditing = false)}>Sluta ändra</Button>
  {:else}
    <NonEditableListing {listing} />
  {/if}
</div>
