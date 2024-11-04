<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  import { Star } from "lucide-svelte";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<Star class={cn("fill-yellow-300 text-yellow-400 w-7 h-7", className)} />
