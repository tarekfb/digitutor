<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "src/lib/shared/utils/utils.js";

  type $$Props = HTMLAttributes<HTMLDivElement> & {
    el?: HTMLDivElement;
  };
  export let el: $$Props["el"] = undefined;
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div bind:this={el} class={cn("flex", className)} {...$$restProps}>
  <slot />
</div>
