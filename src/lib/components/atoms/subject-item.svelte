<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  import Terminal from "lucide-svelte/icons/terminal";
  import { languages } from "src/lib/shared/models/common.ts";
  import type { Subject } from "src/lib/shared/models/subject.ts";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let iconStyling = "";
  export let textStyling = "";
  export let subject: number | Subject;
  export let li: boolean = false;
  export let muted: boolean = true;

  const tag = li ? "li" : "div";
</script>

<svelte:element
  this={tag}
  class={cn(
    `flex items-center gap-x-2 ${muted ? "text-muted-foreground" : ""} overflow-x-hidden`,
    className,
  )}
>
  <Terminal class={cn("size-5 text-accent", iconStyling)} />
  <p class={cn("font-mono md:text-lg", textStyling)}>
    {#if typeof subject === "number"}
      {languages[subject - 1].title}
    {:else}
      {subject.title}
    {/if}
  </p>
</svelte:element>
