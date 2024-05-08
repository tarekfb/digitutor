<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "$lib/components/listing/delete-listing.svelte";
  import MissingListing from "$lib/components/listing/missing-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { listingSchema } from "$lib/models/listing";
  import ListingDescriptionEditable from "src/lib/components/listing/listing-description-editable.svelte";
  import ListingTitleEditable from "src/lib/components/listing/listing-title-editable.svelte";
  import ListingSubjectsEditable from "src/lib/components/listing/listing-subjects-editable.svelte";

  export let data;
  const { listing, user, form } = data;

  let isAuthor = false;
  $: if (user && listing && listing.profile)
    isAuthor = user.id === listing.profile.id;

  let isEditing = {
    title: false,
    description: false,
    hourlyPrice: false,
    subjects: false,
  };

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

  const removeSubject = (subjectId: number) => {
    const newFormData = $formData.subjects.filter(
      (subject) => subject !== subjectId,
    );
    formData.set({ ...$formData, subjects: newFormData });
  };

  const addSubject = (subjectId: number) => {
    if ($formData.subjects.includes(subjectId)) {
      toast.info("Redan tillagd.");
      return;
    }

    const arrayWithSubject = [...$formData.subjects, subjectId];
    const newFormData = { ...$formData, currency: "SEK",subjects: arrayWithSubject };
    formData.set(newFormData);
    
  };
</script>

<div class="p-8 space-y-2">
  {#if !listing}
    <MissingListing />
  {:else if isAuthor}
    <form
      method="POST"
      action="?/updateListing"
      use:enhance
      class="flex flex-col gap-y-4"
    >
      <div class="flex justify-between items-center">
        {#if isEditing.title}
          <ListingTitleEditable
            disabled={$errors.title && $errors.title.length > 0}
            {formData}
            {listingForm}
            bind:isEditing
          />
        {:else}
          <h1 class="text-3xl">{listing.title}</h1>
          <Button on:click={() => (isEditing.title = true)}>Ändra</Button>
        {/if}
      </div>
      <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
      <Separator />
      <div>
        {#if listing.description}
          <p>{listing.description}</p>
        {:else if isEditing.description}
          <ListingDescriptionEditable
            {formData}
            {listingForm}
            bind:isEditing
            disabled={$errors.description && $errors.description.length > 0}
          />
        {:else}
          <div class="flex justify-center gap-x-2">
            <p>Den här annonsen har ingen beskrivning just nu.</p>
            <Button on:click={() => (isEditing.description = true)}
              >Ändra</Button
            >
          </div>
        {/if}
      </div>
      <ListingSubjectsEditable
        {formData}
        {isEditing}
        {listingForm}
        {removeSubject}
        {addSubject}
        subjects={$formData.subjects}
      />
      <SuperDebug data={$formData} />
    </form>
    <DeleteListing />
  {:else}
    <h1 class="text-3xl">{listing.title}</h1>
    <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
    <Separator class="my-4" />
    <div>
      {#if listing.description}
        <p>{listing.description}</p>
      {:else}
        <p>Den här annonsen har ingen beskrivning just nu.</p>
      {/if}
    </div>
  {/if}
</div>
