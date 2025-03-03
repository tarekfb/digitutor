<script lang="ts">
  import { websiteName } from "src/lib/shared/constants/constants.ts";
  import { cn } from "src/lib/shared/utils/utils.js";
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
  <h1>
    {websiteName}
  </h1>
</a>
