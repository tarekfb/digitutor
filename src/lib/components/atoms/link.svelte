<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let href: string;
</script>

<Button
  class={cn("m-0 p-0 text-accent text-base normal-case", className)}
  variant="link"
  on:click={() => goto(href)}
>
  <slot />
</Button>
