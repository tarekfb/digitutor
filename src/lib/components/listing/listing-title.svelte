<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  export let isEditing;
  export let listingForm;
  export let disabled;
  export let formData;
</script>

<div>
  <Form.Field form={listingForm} name="title">
    <Form.Control let:attrs>
      <Input
        {...attrs}
        type="text"
        bind:value={$formData.title}
        placeholder="Rubrik"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <div class="flex justify-end gap-x-4">
    <Form.Button
      type="button"
      variant="secondary"
      on:click={() => {
        isEditing.title = false;
      }}>Avbryt</Form.Button
    >
    <Form.Button type="submit" {disabled}>Spara</Form.Button>
  </div>
</div>

<!-- 
<form method="POST" action="?/updateListing" class="min-h-32 w-full space-y-6">
  <Form.Field form={super_form} name="description">
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
  <div class="flex justify-end gap-x-4">
    <Form.Button
      type="button"
      variant="secondary"
      on:click={() => (isEditingDescription = false)}>Avbryt</Form.Button
    >
    <Form.Button
      type="submit"
      disabled={$errors.description && $errors.description.length > 0}
      >Spara</Form.Button
    >
  </div>
</form> -->
