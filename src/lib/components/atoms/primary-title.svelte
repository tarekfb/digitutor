<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };

  export let id: string | undefined = undefined;
  export let responsiveMb: boolean = false;
  export let responsiveMt: boolean = false;
  export let testId: string | undefined | null = undefined;
  export let tag: "h1" | "h2" | "h3" | "h4" = "h1";
</script>

<!-- heading styling from app.pcss but putting it here helps cn function work properly -->
<svelte:element
  this={tag}
  {id}
  class={cn(
    "text-3xl font-extrabold leading-none tracking-tight md:text-4xl ",
    responsiveMb ? "mb-2 md:mb-4" : "",
    responsiveMt ? "mt-2 md:mt-4" : "",
    className,
  )}
  data-testid={testId}
>
  <slot />
</svelte:element>
