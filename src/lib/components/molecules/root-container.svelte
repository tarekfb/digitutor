<script lang="ts">
  import { cn } from "src/lib/utils";

  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<div class={cn("flex flex-col items-center m-8 gap-y-4", className)}>
  <slot />
</div>
