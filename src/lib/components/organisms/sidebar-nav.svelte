<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button/index.js";

  export let href: string = "";
  export let closeSidebar: undefined | (() => void) = undefined;
  export let disabled = false;
  export let onClick: undefined | (() => void) = undefined;
</script>

<Button
  variant="link"
  {disabled}
  class="p-0 hover:text-accent active:text-accent  {$page.url.pathname === href
    ? 'md:hover:no-underline'
    : ''}"
  on:click={() => {
    if (onClick) onClick();
    if (closeSidebar) closeSidebar();
    if (href) goto(href);
  }}
>
  <div
    class:current={$page.url.pathname === href}
    class="flex items-center gap-x-1 rounded-md p-1 px-1.5 text-lg normal-case tracking-normal text-foreground hover:text-accent md:text-xl"
  >
    <slot />
  </div>
</Button>

<style>
  .current {
    @apply bg-primary text-background no-underline;
  }

  .current:hover {
    @apply bg-accent text-background no-underline;
  }

  .current:active {
    @apply text-background no-underline;
  }
</style>
 