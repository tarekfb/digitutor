<script lang="ts">
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";
  import {
    requestContactSchema,
    startContactSchema,
  } from "src/lib/shared/models/conversation";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import StartContact from "../atoms/start-contact.svelte";
  import { isStartingContact } from "src/stores/start-contact";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let buttonStyling: string | null | undefined = undefined;
  export let requestContactForm;
  export let requestContactAction: string;
  export let startContactForm;
  export let startContactAction: string;
  export let firstName;

  let wasGrantedContact = false;

  const requestContactFormValues = superForm(requestContactForm, {
    validators: zodClient(requestContactSchema),
    onUpdated({ form }) {
      if (form.valid) {
        // request to contact was granted
        isStartingContact.set(true);
        wasGrantedContact = true;
      }
    },
    onSubmit: async (event) => {
      if (wasGrantedContact) {
        event.cancel();
        isStartingContact.set(true);
      }
    },
  });

  const {
    form: formData,
    enhance,
    delayed,
    allErrors,
    message,
  } = requestContactFormValues;

  const startContactFormValues = superForm(startContactForm, {
    // onUpdated({ form }) {
    //   if (form.valid) { // this prevents opening the modal again if navigates back to this page
    //     isStartingContact.set(false);
    //     wasGrantedContact = false;
    //   }
    // },
    validators: zodClient(startContactSchema),
  });
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
    {delayed}
    {allErrors}
    text="Kontakta {firstName}"
    class={buttonStyling}
  />
  <FormMessage {message} scroll />
</form>

<StartContact form={startContactFormValues} action={startContactAction} />
