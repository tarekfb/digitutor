<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let href: string;

  export let target: "" | "_blank" | "_self" | "_parent" | "_top" = "";
  export let ariaLabel: string | null | undefined = undefined;
</script>

<a
  class={cn("font-medium text-accent md:hover:underline", className)}
  {href}
  aria-label={ariaLabel}
  {target}
>
  <slot />
</a>
