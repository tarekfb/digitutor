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
  import AsRead from "src/lib/components/listing/as-read.svelte";

  export let data;
  const { listing, user, form } = data;

  let isAuthor = false;
  $: if (user && listing && listing.profile)
    isAuthor = user.id === listing.profile.id;

  let isEditing = false;

  const listingForm = superForm(form, {
    validators: zodClient(listingSchema),

    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Fixa felen i formuläret.");
      }
    },
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, errors } = listingForm;
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
      <AsRead {listing} />
      <Button on:click={() => (isEditing = true)}>Ändra</Button>
    {/if}
    <Button on:click={() => (isEditing = false)}>Sluta ändra</Button>
  {:else}
    <AsRead {listing} />
  {/if}
</div>

<!-- <h1 class="text-3xl">{listing.title}</h1>
    <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
    <Separator class="my-4" />
    <div>
      {#if listing.description}
        <p>{listing.description}</p>
      {:else}
        <p>Den här annonsen har ingen beskrivning just nu.</p>
      {/if}
    </div> -->
