<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search.ts";
  import SearchResultItem from "./search-result-item.svelte";
  import { languages } from "src/lib/shared/models/common.ts";

  export let results: SearchResult[];
  export let searchTerm = "";

  const isSearchMatchingSubject = (subjectIndex: number): boolean => {
    const labels = getLabels(subjectIndex);
    return labels.some(
      (label) => label.toLowerCase() === searchTerm.toLowerCase(),
    );
  };

  const getLabels = (subjectIndex: number): string[] => {
    const language = languages[subjectIndex - 1];
    if (!language) return [];
    const labels = [language.title, ...(language.altTitle ?? [])];
    return labels;
  };

  // todo write unit tests for this
  const getDisplaySubject = (resultSubject: number[]): number => {
    const noFind = -1;
    if (!searchTerm) return noFind;
    try {
      return (
        resultSubject.find((subjectIndex) =>
          isSearchMatchingSubject(subjectIndex),
        ) ?? noFind
      );
    } catch (error) {
      return noFind;
    }
  };
</script>

<ul class="flex w-full flex-col">
  {#each results as result, i}
    {@const searchedSubject = getDisplaySubject(result.subjects)}
    <li
      class="w-full {i % 2 === 0
        ? 'bg-background'
        : 'bg-card'} flex flex-col items-center p-4 md:p-8"
    >
      <SearchResultItem {result} {searchedSubject} />
    </li>
  {/each}
</ul>
