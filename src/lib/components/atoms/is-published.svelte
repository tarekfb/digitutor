<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let isPublished: boolean | undefined;
  export let variant: "default" | "accent" = "default";

  const styling = () => {
    const primaryBorder = "border border-solid border-primary/25";
    const accentborder = "border border-solid border-accent/25";

    if (variant === "default") {
      if (isPublished) {
        return `bg-green-300 ${primaryBorder}`;
      }
      return `bg-background ${accentborder}`;
    } else if (variant === "accent") {
      if (isPublished) {
        return `bg-green-300 ${primaryBorder}`;
      }
      return `bg-card ${accentborder}`;
    }
  };
</script>

<div
  class={cn(
    `${styling()} tracking-wider p-1.5 md:p-2 font-mono font-normal text-sm rounded-sm self-start whitespace-nowrap`,
    className,
  )}
>
  {#if isPublished}
    PUBLICERAD
  {:else}
    EJ PUBLICERAD
  {/if}
</div>
