<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { updateListingSchema } from "$lib/shared/models/listing.js";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types";
  import RootContainer from "src/lib/components/molecules/root-container.svelte";
  import DeleteListing from "$lib/components/atoms/delete-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import SubjectsEditable from "$lib/components/molecules/subjects-editable.svelte";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { SaveIcon, X } from "lucide-svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Checkbox } from "src/lib/components/ui/checkbox";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import { ExternalLink } from "lucide-svelte";
  import { secondaryAltButtonVariant } from "src/lib/shared/constants/constants";

  export let data: PageData;

  $: ({ subjects, profile } = data);

  const { slug } = $page.params;

  const listingForm = superForm(data.updateListingForm, {
    validators: zodClient(updateListingSchema),
    onUpdated({ form }) {
      if (form.valid) {
        reset({ newState: data.updateListingForm.data });
        toast.success(`Annons uppdaterad.`);
      }
    },
    resetForm: false,
  });

  const {
    form: formData,
    enhance,
    errors,
    delayed,
    allErrors,
    message,
    reset,
  } = listingForm;
</script>

<PrimaryTitle class="text-center">Redigera annons</PrimaryTitle>
<RootContainer class="w-full">
  <FormMessage {message} scroll />
  <form
    method="POST"
    use:enhance
    action="?/updateListing"
    class="flex flex-col gap-y-4 items-stretch"
  >
    <Form.Field form={listingForm} name="title">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          type="text"
          bind:value={$formData.title}
          placeholder="Rubrik"
          class="text-lg bg-card"
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field form={listingForm} name="hourlyPrice">
      <Form.Control let:attrs>
        <div class="flex gap-x-2 items-center text-xl">
          <Input
            {...attrs}
            type="number"
            bind:value={$formData.hourlyPrice}
            placeholder="Ange timpris"
            class="w-32 bg-card"
          />
          SEK
        </div>
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field form={listingForm} name="description">
      <Form.Control let:attrs>
        <Textarea
          {...attrs}
          placeholder="Skriv några ord om din annons..."
          class="resize-y bg-card"
          bind:value={$formData.description}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <SubjectsEditable {formData} {errors} {subjects} />

    <div class="flex flex-col gap-y-4 mt-4 md:items-end">
      <div class="flex justify-between gap-x-2 items-center md:gap-x-6">
        <Form.Field form={listingForm} name="visible">
          <Form.Control let:attrs>
            <div class="flex gap-x-2 items-center">
              <Checkbox
                {...attrs}
                bind:checked={$formData.visible}
                class="w-5 h-5 flex items-center justify-center"
              />
              <Form.Label class="text-xl">Synlig</Form.Label>
            </div>
            <input
              name={attrs.name}
              bind:checked={$formData.visible}
              type="checkbox"
              value={$formData.visible}
              hidden
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Button
          variant="secondary"
          href="/profile/{profile.id}?id={slug}"
          class="flex gap-x-2 {secondaryAltButtonVariant()}"
          ><ExternalLink class="h-4 w-4" />visa annons</Button
        >
      </div>
      <div class="flex justify-between gap-x-2 md:gap-x-6">
        <DeleteListing />
        <Button type="submit" disabled={$allErrors.length > 0 || $delayed}>
          {#if $delayed}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            <SaveIcon class="mr-2 h-5 w-5" />
            Spara
          {/if}
        </Button>
      </div>
    </div>
  </form>
</RootContainer>
