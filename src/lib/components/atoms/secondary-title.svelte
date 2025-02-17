<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };

  export let responsiveMb: boolean = false;
  export let responsiveMt: boolean = false;
</script>

<!-- heading styling from app.pcss but putting it here helps cn function work properly -->
<h2
  class={cn(
    "text-xl font-semibold leading-none tracking-tight md:text-2xl",
    responsiveMb ? "mb-2 md:mb-4" : "",
    responsiveMt ? "mt-2 md:mt-4" : "",
    className,
  )}
>
  <slot />
</h2>
