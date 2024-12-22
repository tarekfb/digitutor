<script lang="ts">
  import { Label } from "$lib/components/ui/form/index.js";
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<Label class={cn("font-semibold", className)}>
  <slot />
</Label>
