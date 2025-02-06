<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";
  import type { Variant } from "$lib/components/ui/button/index.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let delayed;
  export let allErrors;
  export let text: string;
  export let variant: Variant = "default";
  export let loadingText = text;
  export let disabled = false;
</script>

<Button
  type="submit"
  {variant}
  disabled={$allErrors.length > 0 || $delayed || disabled}
  class={cn("flex items-center gap-x-2", className)}
>
  {#if $delayed}
    <LoadingSpinner />
    {#if loadingText}
      <span>{loadingText}</span>
    {/if}
  {:else}
    <slot name="icon" />
    {text}
  {/if}
</Button>
