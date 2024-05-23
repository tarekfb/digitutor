<script lang="ts">
  import { cn } from "$lib/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<h1 class={cn("text-2xl font-bold", className)}>
  <slot />
</h1>
