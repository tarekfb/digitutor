<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  export let listingForm;
  export let formData;
</script>

<Form.Field form={listingForm} name="title">
  <Form.Control let:attrs>
    <Input
      {...attrs}
      type="text"
      bind:value={$formData.title}
      placeholder="Rubrik"
      class="text-2xl"
    />
  </Form.Control>
  <Form.FieldErrors />
</Form.Field>
