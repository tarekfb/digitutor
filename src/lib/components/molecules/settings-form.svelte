<script lang="ts">
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";
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
  export let id: string | undefined = undefined;

  const { enhance, delayed, allErrors, message } = form;
</script>

<form
  method="POST"
  use:enhance
  {action}
  class={cn("generic-card flex w-full flex-col gap-y-4", className)}
  enctype={enctype ?? "application/x-www-form-urlencoded"}
  {id}
>
  <SecondaryTitle>{title}</SecondaryTitle>
  <slot />
  {#if shouldHaveSubmit}
    <FormMessage {message} scroll />
    <FormSubmit
      {delayed}
      {allErrors}
      text={submitText}
      class="md:min-w-wider md:self-center {submitStyling}"
    />
  {/if}
</form>
