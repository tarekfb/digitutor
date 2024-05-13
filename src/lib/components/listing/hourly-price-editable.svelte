<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  export let listingForm;
  export let formData;
</script>

<Form.Field form={listingForm} name="hourlyPrice">
  <Form.Control let:attrs>
    <input
      {...attrs}
      type="number"
      bind:value={$formData.hourlyPrice}
      placeholder="Välj timpris"
    />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
