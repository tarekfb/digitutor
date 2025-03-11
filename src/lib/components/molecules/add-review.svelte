<script lang="ts">
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    addReviewSchema,
    type AddReviewSchema,
  } from "src/lib/shared/models/review.ts";
  import Label from "$lib/components/atoms/label.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Plus from "lucide-svelte/icons/plus";
  import Star from "lucide-svelte/icons/star";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import type { Profile } from "src/lib/shared/models/profile.ts";

  export let form: SuperValidated<Infer<AddReviewSchema>>;
  export let teacher: Profile;

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
        variant: "outline-card",
        className: `icon-button md:self-start`,
      }),
    )}
  >
    Lägg till recension<Plus /></Dialog.Trigger
  >
  <Dialog.Content class="bg-card sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Lägg till recension</Dialog.Title>
      <Dialog.Description>
        Här kan du göra en recension till {teacher.firstName}.
      </Dialog.Description>
    </Dialog.Header>
    <form
      action="?/addReview"
      use:enhance
      method="POST"
      class="flex flex-col gap-y-4"
    >
      <Form.Field form={formValues} name="rating">
        <Form.Control let:attrs>
          <Label>Betyg</Label>
          <div class="flex items-center gap-x-2 text-xl">
            <Input
              {...attrs}
              type="number"
              bind:value={$formData.rating}
              placeholder="Välj timpris"
              class="w-14 rounded-sm border bg-gray-100 p-2"
            />
            <Star class="text-yellow-500" />
          </div>
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={formValues} name="description">
        <Form.Control let:attrs>
          <Label>Beskriv din lektion med {teacher.firstName}</Label>
          <Textarea
            {...attrs}
            placeholder="Vad stack ut?"
            class="resize-y"
            bind:value={$formData.description}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <FormMessage {message} scroll />
      <div class="flex justify-end gap-x-4">
        <Dialog.Footer>
          <Dialog.Close asChild let:builder>
            <Button variant="outline" builders={[builder]}>Avbryt</Button>
          </Dialog.Close>
        </Dialog.Footer>
        <FormSubmit {delayed} {allErrors} text="Lägg till" />
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
