<script lang="ts">
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let submitting;
  export let allErrors;
  export let firstName: string;
</script>

<FormSubmit
  class={cn("", className)}
  {submitting}
  {allErrors}
  text="Kontakta {firstName}"
/>
