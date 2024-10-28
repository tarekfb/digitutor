<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import SearchResultItemMobile from "./search-result-item-mobile.svelte";
  import { Separator } from "src/lib/components/ui/separator";
  export let results: SearchResult[];
</script>

<ul class="flex flex-col gap-y-4 w-full">
  {#each results as result, i}
    <li>
      <SearchResultItemMobile {result} />
    </li>
    {#if results.length === 1 || (results.length > 1 && i !== results.length - 1) || (i !== results.length - 1 && results.length > 2)}
      <Separator
        class="-mx-4 {results.length === 1 ? 'hidden md:block' : ''} "
      />
    {/if}
  {/each}
</ul>
