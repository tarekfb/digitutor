<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let responsiveGap = false;
  export let maxWidth = false;
  export let minWidth = false;
</script>

<div
  class={cn(
    "m-8 flex flex-col items-center",
    responsiveGap ? "gap-y-2 md:gap-y-4" : "gap-y-4",
    maxWidth ? "md:max-w-screen-sm lg:max-w-screen-md" : "",
    minWidth ? "min-w-full px-8 md:min-w-[400px] md:px-0 lg:min-w-[500px]" : "",
    className,
  )}
>
  <slot />
</div>
