<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";
  import { Terminal } from "lucide-svelte";
  import { languages } from "src/lib/shared/models/common";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let iconStyling = "";
  export let textStyling = "";
  export let subject: number;
  export let li = true;
  export let muted = true;
</script>

{#if li}
  <li
    class={cn(
      `flex gap-x-2 items-center ${muted ? "text-muted-foreground" : ""}  overflow-x-hidden`,
      className,
    )}
  >
    <Terminal class={cn("w-5 h-5 text-accent", iconStyling)} />
    <p class={cn("font-mono md:text-lg", textStyling)}>
      {languages[subject - 1].title}
    </p>
  </li>
{:else}
  <div
    class={cn(
      `flex gap-x-2 items-center ${muted ? "text-muted-foreground" : ""}  overflow-x-hidden`,
      className,
    )}
  >
    <Terminal class={cn("w-5 h-5 text-accent", iconStyling)} />
    <p class={cn("font-mono md:text-lg", textStyling)}>
      {languages[subject - 1].title}
    </p>
  </div>
{/if}
