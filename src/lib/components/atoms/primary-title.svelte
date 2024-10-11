<script lang="ts">
  import { cn } from "$lib/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<h1 class={cn("text-2xl md:text-4xl font-bold whitespace-nowrap ", className)}>
  <slot />
</h1>
