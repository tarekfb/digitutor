<script lang="ts">
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let isPublished: boolean | undefined;
</script>

<div
  class={cn(
    `${
      isPublished ? "bg-green-300" : "bg-slate-100"
    } tracking-wider p-1.5 md:p-2 font-mono font-normal text-sm rounded-sm self-start whitespace-nowrap `,
    className,
  )}
>
  {#if isPublished}
    PUBLICERAD
  {:else}
    EJ PUBLICERAD
  {/if}
</div>
