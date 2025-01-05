<script lang="ts">
  import { Label } from "$lib/components/ui/form/index.js";
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let hidden: boolean = false;
</script>

<Label class={cn("font-semibold", hidden && "sr-only",  className)}>
  <slot />
</Label>
