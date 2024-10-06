<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button";

  export let href: string = "";
  export let closeSidebar: undefined | (() => void) = undefined;
  export let disabled = false;
  export let onClick: undefined | (() => void) = undefined;
</script>

<Button
  variant="link"
  {disabled}
  class="hover:no-underline hover:text-accent active:text-accent p-0"
  on:click={() => {
    if (onClick) onClick();
    if (closeSidebar) closeSidebar();
    if (href) goto(href);
  }}
>
  <div
    class:current={$page.url.pathname === href}
    class="flex items-center gap-x-1 p-1 px-1.5 rounded-md text-base normal-case text-foreground tracking-normal"
  >
    <slot />
  </div>
</Button>

<style>
  .current {
    @apply bg-primary text-background hover:bg-accent hover:text-background active:text-background;
  }
</style>
