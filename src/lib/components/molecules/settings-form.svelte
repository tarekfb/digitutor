<script lang="ts">
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { cn } from "$lib/utils.js";
  import SecondaryTitle from "../atoms/secondary-title.svelte";

  export let submitStyling: string | null | undefined = undefined;

  let className: string | null | undefined = undefined;
  export { className as class };

  export let form;
  export let submitText = "Uppdatera";
  export let action: string;
  export let title: string;
  export let shouldHaveSubmit = true;
  export let enctype = "";

  const { enhance, submitting, allErrors, message } = form;
</script>

<form
  method="POST"
  use:enhance
  {action}
  class={cn("flex flex-col gap-y-4 generic-card", className)}
  enctype="{enctype ?? 'application/x-www-form-urlencoded'}"
>
  <SecondaryTitle>{title}</SecondaryTitle>
  <FormMessage {message} scroll />
  <slot />
  {#if shouldHaveSubmit}
    <FormSubmit
      {submitting}
      {allErrors}
      text={submitText}
      class="md:self-center md:min-w-wider {submitStyling}"
    />
  {/if}
</form>
