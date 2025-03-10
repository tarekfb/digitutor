<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  import Logo from "./logo.svelte";
  let className: string | null | undefined = undefined;
  export { className as class };
</script>

<a
  href="/"
  class={cn(
    "text-xl font-medium uppercase md:text-3xl md:hover:text-third",
    className,
  )}
>
  <Logo width={200} height={50} />
</a>
