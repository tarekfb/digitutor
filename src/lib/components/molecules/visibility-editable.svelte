<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "../ui/checkbox";

  export let listingForm;
  export let formData;
</script>

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
    <input name={attrs.name} value={$formData.mobile} hidden />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
