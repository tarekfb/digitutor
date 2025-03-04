<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.ts";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let responsiveGap = false;
  export let maxWidth = false;
  export let minWidth = false;
  export let tag = "div";
</script>

<svelte:element
  this={tag}
  class={cn(
    "m-4 md:m-8 flex flex-col items-center",
    responsiveGap ? "gap-y-2 md:gap-y-4" : "gap-y-4",
    maxWidth ? "max-w-full md:max-w-screen-sm lg:max-w-screen-md" : "",
    minWidth ? "min-w-full px-4 md:min-w-[400px] md:px-0 lg:min-w-[500px]" : "",
    className,
  )}
>
  <slot />
</svelte:element>
