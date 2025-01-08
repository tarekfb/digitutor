<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<h2
  class={cn(
    "overflow-x-hidden overflow-y-hidden whitespace-nowrap text-xl font-semibold md:text-2xl",
    className,
  )}
>
  <slot />
</h2>
