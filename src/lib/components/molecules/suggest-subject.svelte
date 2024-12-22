<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "./form-message.svelte";
  import FormSubmit from "./form-submit.svelte";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms/client";
  import { suggestSubjectSchema } from "src/lib/shared/models/subject";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Checkbox } from "../ui/checkbox";
  import { toast } from "svelte-sonner";
  import { MessageId } from "src/lib/shared/constants/constants";

  export let suggestSubjectForm: SuperValidated<
    Infer<typeof suggestSubjectSchema>
  >;
  let open = false;

  const suggestSubject = superForm(suggestSubjectForm, {
    validators: zodClient(suggestSubjectSchema),
    onSubmit({ formData, cancel }) {
      if (checked && !$form.email) {
        toast.warning("Ange e-postaddress för att bli notifierad.");
        cancel();
      } else if ($message && $message.id === MessageId.ResourceAlreadyExists) {
        formData.set("isRetry", "true");
      }
    },
    onUpdate({ form }) {
      if (form.valid) {
        open = false;
        const actionText = checked
          ? "Vi kontaktar dig så snart vi kan."
          : "Vi hanterar ärendet så snart vi kan.";
        setTimeout(
          () => toast.success(`Skickat in förslaget. ${actionText}`),
          250,
        );
        // timeout to improve ux
      }
    },
  });

  let checked = false;
  $: submitText =
    $message?.id === MessageId.ResourceAlreadyExists
      ? "Skicka in igen"
      : "Skicka in";

  const { form, enhance, delayed, allErrors, message, errors } = suggestSubject;

  const cleanEmail = () => {
    // the on click is executed before the checked value is updated causing checked value to be inverted
    // what we are saying: if user is detoggling the checkbox --> clear the email input
    if (checked) $form.email = undefined;
  };
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger asChild let:builder>
    <small
      class="text-muted-foreground -mt-4 md:-mt-2 md:text-lg flex justify-center gap-x-2 items-center"
      >Saknar du något i listan? <Button
        variant="link"
        class="px-0"
        builders={[builder]}>Ge förslag</Button
      ></small
    >
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px] bg-card">
    <Dialog.Header>
      <Dialog.Title>Skicka in förslag</Dialog.Title>
      <Dialog.Description>
        Vill du föreslå något som saknades bland alternativen? Skicka in
        förslaget så hanterar vi ärendet så snart vi kan.
      </Dialog.Description>
    </Dialog.Header>
    <FormMessage
      {message}
      class={$message?.variant === "destructive" ? "bg-card" : "bg-background"}
    />
    <form
      method="POST"
      action="?/suggestSubject"
      use:enhance
      class="flex flex-col gap-y-4"
      autocomplete="off"
    >
      <Form.Field form={suggestSubject} name="subject">
        <Form.Control let:attrs>
          <Label>Detta saknades i listan</Label>
          <Input {...attrs} type="text" bind:value={$form.subject} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      {#if checked}
        <Form.Field form={suggestSubject} name="email">
          <Form.Control let:attrs>
            <Label>E-postadress</Label>
            <Input {...attrs} type="text" bind:value={$form.email} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {/if}
      <div class="flex items-center space-x-2">
        <Checkbox
          id="toggle-email"
          bind:checked
          aria-labelledby="show-email"
          on:click={cleanEmail}
        />
        <Label
          id="show-email"
          for="toggle-email"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Notifiera mig
        </Label>
      </div>
      <div class="flex justify-end gap-x-4">
        <Dialog.Footer>
          <Dialog.Close asChild let:builder>
            <Button variant="outline" builders={[builder]}>Avbryt</Button>
          </Dialog.Close>
        </Dialog.Footer>
        <FormSubmit {delayed} {allErrors} text={submitText} />
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
