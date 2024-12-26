<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<h1 class={cn("text-3xl md:text-4xl whitespace-nowrap heading ", className)}>
  <slot />
</h1>
