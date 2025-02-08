<!-- <script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let href: string;
</script>

<Button
  class={cn("m-0 p-0 text-base normal-case text-accent", className)}
  variant="link"
  on:click={() => goto(href)}
>
  <slot />
</Button>
 -->

<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let href: string;

  let ariaLabel: string | null | undefined = undefined;
  export { ariaLabel as "aria-label" };
</script>

<a
  class={cn("font-medium text-accent hover:underline", className)}
  {href}
  aria-label={ariaLabel}
>
  <slot />
</a>
