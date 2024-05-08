<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "$lib/components/listing/delete-listing.svelte";
  import MissingListing from "$lib/components/listing/missing-listing.svelte";
  import ListingDescription from "$lib/components/listing/listing-description.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { listingSchema } from "$lib/models/listing";
  import ListingTitle from "src/lib/components/listing/listing-title.svelte";
  import { Subjects } from "src/lib/models/common.js";
  import { Plus } from "lucide-svelte";
  import { CircleMinus } from "lucide-svelte";

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
        toast.error("Please fix the errors in the form.");
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
    <form
      method="POST"
      action="?/updateListing"
      use:enhance
      class="flex flex-col gap-y-4"
    >
      <div class="flex justify-between items-center">
        {#if isEditing.title}
          <ListingTitle
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
          <ListingDescription
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
      <div class="space-y-2">
        {#if listing.subjects.length > 0}
          <div class="flex gap-x-2 items-center">
            {#each listing.subjects as subject}
              <div
                class="bg-slate-100 flex justify-between items-center gap-x-1 p-1 rounded-lg"
              >
                <p>{Subjects[subject]}</p>
                <Button variant="destructive" size="icon"
                  ><CircleMinus /></Button
                >
              </div>
            {/each}
          </div>

          {#if isEditing.subjects}
            <div class="flex justify-between items-center">
              <p>dropdown</p>

              <div class="flex justify-end gap-x-4 w-full">
                <Button
                  type="button"
                  variant="secondary"
                  on:click={() => {
                    isEditing.subjects = false;
                  }}>Avbryt</Button
                >
                <Button
                  on:click={() => {
                    isEditing.subjects = false;
                  }}>Spara</Button
                >
                <!-- <Form.Button type="submit" {disabled}>Spara</Form.Button> -->
              </div>
            </div>
          {:else}
            <Button size="icon" on:click={() => (isEditing.subjects = true)}
              ><Plus /></Button
            >
          {/if}
        {/if}
      </div>
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
