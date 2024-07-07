<script lang="ts">
  import Star from "./star.svelte";
  import { cn } from "$lib/utils.js";
  let className: string | null | undefined = undefined;
  export { className as class };

  const handleRounding = (rating: number) => {
    let rounded = Math.round(rating);
    if (rounded > 5) rounded = 5;
    if (rounded < 1) rounded = 1;
    return rounded;
  };

  export let rating: number;
  export let size = 7;
  const rounded = handleRounding(rating);
  const rest = 5 - rounded;
</script>

<div class={cn("flex gap-x-0.5", className)}>
  {#each [...Array(rounded)] as _}
    <Star class="w-{size} h-{size}" />
  {/each}
  {#each [...Array(rest)] as _}
    <Star class="fill-none w-{size} h-{size}" />
  {/each}
</div>
