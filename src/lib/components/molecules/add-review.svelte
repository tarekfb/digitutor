<script lang="ts">
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";
  import  {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import {
    addReviewSchema,
    type AddReviewSchema,
  } from "src/lib/shared/models/review";
  import Label from "$lib/components/atoms/label.svelte";
  import * as Form from "$lib/components/ui/form";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Plus, Star } from "lucide-svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import type { Tables } from "src/supabase";
  import { Textarea } from "../ui/textarea";

  export let form: SuperValidated<Infer<AddReviewSchema>>;
  export let teacher: Tables<"profiles">;

  let open = false;

  const formValues = superForm(form, {
    validators: zodClient(addReviewSchema),
    onUpdated({ form }) {
      if (form.valid) open = false;
    },
  });

  const { form: formData, enhance, delayed, allErrors, message } = formValues;
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger
    class={cn(
      buttonVariants({
        variant: "white",
        className: "flex gap-x-2 self-center",
      }),
    )}
  >
    <Plus />Lägg till recension</Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[425px] bg-card">
    <Dialog.Header>
      <Dialog.Title>Lägg till recension</Dialog.Title>
      <Dialog.Description>
        Här kan du göra en recension till {teacher.first_name}.
      </Dialog.Description>
    </Dialog.Header>
    <FormMessage {message} scroll />
    <form
      action="?/addReview"
      use:enhance
      method="POST"
      class="flex flex-col gap-y-4"
    >
      <Form.Field form={formValues} name="rating">
        <Form.Control let:attrs>
          <Label>Betyg</Label>
          <div class="flex gap-x-2 items-center text-xl">
            <Input
              {...attrs}
              type="number"
              bind:value={$formData.rating}
              placeholder="Välj timpris"
              class="p-2 border bg-gray-100 rounded-sm w-14"
            />
            <Star class="text-yellow-500" />
          </div>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={formValues} name="description">
        <Form.Control let:attrs>
          <Label>Beskriv din lektion med {teacher.first_name}</Label>
          <Textarea
            {...attrs}
            placeholder="Vad stack ut?"
            class="resize-y"
            bind:value={$formData.description}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <div class="flex justify-end gap-x-4">
        <Dialog.Footer>
          <Dialog.Close asChild let:builder>
            <Button variant="outline" builders={[builder]}>Avbryt</Button>
          </Dialog.Close>
        </Dialog.Footer>
        <FormSubmit
          {delayed}
          {allErrors}
          text="Lägg till"
        />
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
