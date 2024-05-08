<script lang="ts" context="module">
  import { z } from "zod";
  export const formSchema = z.object({
    description: z
      .string()
      .min(10, "Beskrivningen måste vara minst 10 karaktärer.")
      .max(160, "Description must be at most 160 characters."),
  });
  export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
  import {
     type Infer,
     type SuperValidated,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  let data: SuperValidated<Infer<FormSchema>> = $page.data.textarea;
  export { data as form };

  const form = superForm(data, {
    validators: zodClient(formSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    },
  });

  const { form: formData, enhance } = form;
  export let isEditingDescription = false;
</script>

<form method="POST" action="?/textarea" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="description">
    <Form.Control let:attrs>
      <Textarea
        {...attrs}
        placeholder="Skriv några ord om din annons..."
        class="resize-none"
        bind:value={$formData.description}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button type="submit">Spara</Form.Button>
  <Form.Button type="button" variant="secondary" on:click={() => isEditingDescription = false}>Avbryt</Form.Button>
</form>
