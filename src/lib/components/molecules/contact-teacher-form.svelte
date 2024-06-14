<script lang="ts">
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import { cn } from "$lib/utils.js";
  import {
    requestContactSchema,
    startContactSchema,
  } from "src/lib/models/conversations";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import StartContact from "../atoms/start-contact.svelte";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let buttonStyling: string | null | undefined = undefined;
  export let requestContactForm;
  export let requestContactAction: string;
  export let startContactForm;
  export let startContactAction: string;
  export let firstName;

  let isStartingContact = false;
  let wasGrantedContact = false;

  const requestContactFormValues = superForm(requestContactForm, {
    validators: zodClient(requestContactSchema),
    onUpdated({ form }) {
      if (form.valid) {
        // request to contact was granted
        isStartingContact = true;
        wasGrantedContact = true;
      }
    },
    onSubmit: async (event) => {
      if (wasGrantedContact) {
        event.cancel();
        isStartingContact = true;
      }
    },
  });

  const {
    form: formData,
    enhance,
    submitting,
    allErrors,
    message,
  } = requestContactFormValues;

  const startContactFormValues = superForm(startContactForm, {
    validators: zodClient(startContactSchema),
  });

  const toggleModal = () => {
    isStartingContact = !isStartingContact;
  };
</script>

<form
  method="POST"
  use:enhance
  action={requestContactAction}
  class={cn("flex flex-col gap-y-4", className)}
>
  <input type="hidden" name="teacher" value={$formData.teacher} />
  <input type="hidden" name="role" value={$formData.role} />
  <FormSubmit
    {submitting}
    {allErrors}
    text="Kontakta {firstName}"
    class={buttonStyling}
  />
  <FormMessage message={$message} scroll />
</form>

<StartContact
  form={startContactFormValues}
  action={startContactAction}
  {toggleModal}
  open={isStartingContact}
/>
