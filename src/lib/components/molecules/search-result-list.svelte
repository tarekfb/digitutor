<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import SecondaryTitle from "../atoms/secondary-title.svelte";
  import SearchResultItem from "./search-result-item.svelte";

  export let results: SearchResult[];
</script>

<ul class="flex flex-col gap-y-4 w-full">
  <SecondaryTitle>Sökresultat</SecondaryTitle>
  {#each results as result}
    <li>
      <SearchResultItem {result} />
    </li>
  {/each}
</ul>
