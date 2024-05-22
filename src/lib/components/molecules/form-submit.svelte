<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import { cn } from "$lib/utils.js";
  import type { Variant } from "../ui/button";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let submitting;
  export let allErrors;
  export let text: string;
  export let variant: Variant = "default";
  export let loadingText = "Laddar...";
</script>

<Button
  type="submit"
  {variant}
  disabled={$allErrors.length > 0 || $submitting}
  class={cn("", className)}
>
  {#if $submitting}
    <LoadingSpinner class="mr-2" /> <span>{loadingText}</span>
  {:else}
    {text}
  {/if}
</Button>
