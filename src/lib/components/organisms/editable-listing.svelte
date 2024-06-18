<script lang="ts">
  import DeleteListing from "$lib/components/atoms/delete-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Checkbox } from "../ui/checkbox";
  import SubjectsEditable from "$lib/components/molecules/subjects-editable.svelte";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { SaveIcon, X } from "lucide-svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  export let listingForm;
  export let stopEditing: () => void;

  const {
    form: formData,
    enhance,
    errors,
    submitting,
    allErrors,
    message,
  } = listingForm;
</script>

<FormMessage {message} scroll />
<form
  method="POST"
  use:enhance
  action="?/updateListing"
  class="flex flex-col gap-y-4 generic-card"
>
  <Form.Field form={listingForm} name="title">
    <Form.Control let:attrs>
      <Input
        {...attrs}
        type="text"
        bind:value={$formData.title}
        placeholder="Rubrik"
        class="text-lg"
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
          class="w-32"
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
        class="resize-y"
        bind:value={$formData.description}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <SubjectsEditable {formData} {errors} />

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

  <div class="flex justify-end gap-x-2">
    <Button on:click={stopEditing} variant="secondary">
      <X class="mr-2 h-5 w-5" />
      Avbryt
    </Button>
    <Button type="submit" disabled={$allErrors.length > 0 || $submitting}>
      {#if $submitting}
        <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
      {:else}
        <SaveIcon class="mr-2 h-5 w-5" />
        Spara
      {/if}
    </Button>
  </div>
  <div class="self-end">
    <DeleteListing />
  </div>
</form>
