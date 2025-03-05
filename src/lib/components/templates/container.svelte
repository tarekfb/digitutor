<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.ts";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let responsiveGap = false;
  export let maxWidth = false;
  export let minWidth = false;
  export let margin = true;
  export let padding = false;
  export let tag = "div";
</script>

<svelte:element
  this={tag}
  class={cn(
    "flex flex-col items-center",
    responsiveGap ? "gap-y-2 md:gap-y-4" : "gap-y-4",
    padding ? "p-4 md:p-8" : "",
    maxWidth ? "max-w-full md:max-w-screen-sm lg:max-w-screen-md" : "",
    minWidth ? "min-w-full px-4 md:min-w-[400px] md:px-4 lg:min-w-[500px]" : "",
    margin ? "m-4 md:m-8" : "",
    className,
  )}
>
  <slot />
</svelte:element>
