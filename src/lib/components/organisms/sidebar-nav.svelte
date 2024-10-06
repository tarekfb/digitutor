<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";

  export let href: string;
  export let closeSidebar: undefined | (() => void) = undefined;
  export let disabled = false;
  export let onClick: undefined | (() => void) = undefined;
</script>

<Button
  variant="link"
  {disabled}
  class=" m-0 p-0 text-base normal-case text-foreground hover:no-underline flex items-center gap-x-1 hover:text-accent active:text-accent tracking-normal -my-1"
  on:click={() => {
    if (onClick) onClick();
    else {
      if (closeSidebar) closeSidebar();
      goto(href);
    }
  }}
>
  <slot />
</Button>
