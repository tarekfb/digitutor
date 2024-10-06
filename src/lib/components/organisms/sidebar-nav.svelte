<script lang="ts">
  import Link from "../atoms/link.svelte";

  export let href: string;
</script>

<Link
  class="text-foreground hover:no-underline flex items-center gap-x-1 hover:text-accent active:text-accent"
  {href}
>
  <slot />
</Link>
