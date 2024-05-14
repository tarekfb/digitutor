<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";

  export let listingForm;
  export let formData;
</script>

<Form.Field form={listingForm} name="hourlyPrice">
  <Form.Control let:attrs>
    <div class="flex gap-x-2 items-center text-xl">
      <input
        {...attrs}
        type="number"
        bind:value={$formData.hourlyPrice}
        placeholder="Välj timpris"
        class="p-2 border bg-gray-100 rounded-lg w-16"
      />
      SEK
    </div>
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
