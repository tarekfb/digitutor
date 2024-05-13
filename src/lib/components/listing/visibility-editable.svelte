<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "../ui/checkbox";

  export let listingForm;
  export let formData;
</script>

<Form.Field form={listingForm} name="visible">
  <Form.Control let:attrs>
    <div class="flex gap-x-2">
      <Checkbox {...attrs} bind:checked={$formData.visible} />
      <Form.Label>Synlig</Form.Label>
    </div>
    <input name={attrs.name} value={$formData.mobile} hidden />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
