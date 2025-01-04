<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let responsiveGap = true;
  export let maxWidth = true;
</script>

<div
  class={cn(
    "m-8 flex flex-col items-center",
    responsiveGap ? "gap-y-2 md:gap-y-4" : "gap-y-4",
    maxWidth ? "md:max-w-screen-sm lg:max-w-screen-md" : "",
    className,
  )}
>
  <slot />
</div>
