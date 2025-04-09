<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.ts";
  let className: string | null | undefined = undefined;
  export { className as class };

  export let text: string | undefined = undefined;
  export let max: number;
  export let indicateOver = true;
  export let errors: string[] | null | undefined = undefined;
</script>

{#if text !== undefined}
  <span
    class={cn(
      "text-sm font-medium text-muted-foreground",
      indicateOver && text.length > max ? "text-destructive" : "",
      errors && errors.length > 0 ? "text-destructive" : "",
      className,
    )}>{text.length}/{max}</span
  >{/if}
