<script lang="ts">
  import { cn } from "$lib/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<h2 class={cn("text-xl md:text-2xl font-semibold whitespace-nowrap overflow-x-hidden", className)}>
  <slot />
</h2>
