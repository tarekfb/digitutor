<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
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