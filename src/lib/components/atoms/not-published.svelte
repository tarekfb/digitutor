<script lang="ts">
  import { cn } from "$lib/utils.js";
  let className: string | null | undefined = undefined;

  export { className as class };
  export let visible: boolean | undefined;
</script>

{#if visible === false}
  <div
    class={cn("bg-slate-100 p-1 font-normal text-sm rounded-md self-start border-primary border-solid border", className)}
  >
    Ej publicerad
  </div>
{/if}
