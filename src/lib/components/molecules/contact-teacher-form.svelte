<script lang="ts">
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import { cn } from "$lib/utils.js";

  export let buttonStyling: string | null | undefined = undefined;

  let className: string | null | undefined = undefined;
  export { className as class };

  export let form;
  export let firstName;
  export let action: string;

  const { form: formData, enhance, submitting, allErrors, message } = form;
</script>

<form
  method="POST"
  use:enhance
  {action}
  class={cn("flex flex-col gap-y-4 mx-8", className)}
>
  <input type="hidden" name="teacher" value={$formData.teacher} />
  <FormSubmit
    {submitting}
    {allErrors}
    text="Kontakta {firstName}"
    class={buttonStyling}
  />
  <FormMessage {message} scroll />
</form>
