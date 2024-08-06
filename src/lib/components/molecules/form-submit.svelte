<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { cn } from "$lib/utils.js";
  import type { Variant } from "../ui/button";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let submitting;
  export let allErrors;
  export let text: string;
  export let variant: Variant = "default";
  export let loadingText = "Laddar...";
  export let disabled = false;
</script>

<Button
  type="submit"
  {variant}
  disabled={$allErrors.length > 0 || $submitting || disabled}
  class={cn("", className)}
>
  {#if $submitting}
    <LoadingSpinner class="{loadingText && 'mr-2'}" />
    {#if loadingText}
      <span>{loadingText}</span>
    {/if}
  {:else}
    {text}
  {/if}
</Button>
