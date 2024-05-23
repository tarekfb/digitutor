<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  export let listingForm;
  export let formData;
</script>

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
