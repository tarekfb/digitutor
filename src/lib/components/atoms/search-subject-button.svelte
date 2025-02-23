<script lang="ts">
  import { cn } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export let textStyling: string | null | undefined = undefined;
  export { className as class };
  export let text: string;
  export let onClickCallback;
  export let ariaLabel: string | null | undefined = "";

  const subjectChipStyling =
    "h-12 grow inline-flex gap-x-2 items-center px-2 py-1 text-sm bg-background rounded-full md:hover:bg-background";
</script>

<button
  on:click={() => onClickCallback(text)}
  class={cn(subjectChipStyling, className)}
  aria-label={ariaLabel}
>
  <span class={textStyling}>{text}</span>
  <slot />
</button>
