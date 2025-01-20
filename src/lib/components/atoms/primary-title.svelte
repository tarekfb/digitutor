<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };

  export let responsiveMb: boolean = false;
  export let responsiveMt: boolean = false;
</script>

<h1
  class={cn(
    "heading whitespace-nowrap text-3xl md:text-4xl ",
    responsiveMb ? "mb-2 md:mb-4" : "",
    responsiveMt ? "mt-2 md:mt-4" : "",
    className,
  )}
>
  <slot />
</h1>
