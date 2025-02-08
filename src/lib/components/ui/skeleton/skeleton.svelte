<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.ts";
  import type { HTMLAttributes } from "svelte/elements";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div class={cn("animate-pulse rounded-md", className)} {...$$restProps}></div>
