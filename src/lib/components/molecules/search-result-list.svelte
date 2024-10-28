<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import SearchResultItemMobile from "./search-result-item-mobile.svelte";
  import { Separator } from "src/lib/components/ui/separator";

  export let results: SearchResult[];

  const hasMultiple = results.length > 1;
</script>

<ul class="flex flex-col gap-y-4 w-full">
  {#each results as result, i}
    {@const isLast = results.length - 1 === i}
    {@const hasBelow = results.length !== 1 && !isLast}
    <li class="p-4">
      <SearchResultItemMobile {result} />
    </li>
    {#if (hasMultiple && !isLast) || hasBelow}
      <Separator />
    {/if}
  {/each}
</ul>
