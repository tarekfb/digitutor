<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search.ts";
  import SearchResultItem from "./search-result-item.svelte";
  import { Separator } from "src/lib/components/ui/separator/index.js";
  import { languages } from "src/lib/shared/models/common.ts";
  import SecondaryTitle from "../atoms/secondary-title.svelte";

  export let results: SearchResult[];
  export let searchTerm = "";

  const hasMultiple = results.length > 1;

  const isSearchMatchingSubject = (subjectIndex: number): boolean => {
    const labels = getLabels(subjectIndex);
    return labels.some(
      (label) => label.toLowerCase() === searchTerm.toLowerCase(),
    );
  };

  const getLabels = (subjectIndex: number): string[] => {
    const language = languages[subjectIndex - 1];
    const labels = [language.title, ...(language.altTitle ?? [])];
    return labels;
  };

  const getDisplaySubject = (result: SearchResult): number => {
    const defaultSubject = result.subjects[0];
    if (!searchTerm) return defaultSubject;
    return (
      result.subjects.find((subjectIndex) =>
        isSearchMatchingSubject(subjectIndex),
      ) ?? defaultSubject
    );
  };
</script>

<SecondaryTitle class="foreground self-start">
  {results.length} lärare tillgänglig{results.length > 1 ? "a" : ""}
</SecondaryTitle>
<ul class="flex w-full flex-col gap-y-4">
  {#each results as result, i}
    {@const isLast = results.length - 1 === i}
    {@const hasBelow = results.length !== 1 && !isLast}
    {@const searchedSubject = getDisplaySubject(result)}
    <li class="w-full">
      <SearchResultItem {result} {searchedSubject} />
    </li>
    {#if (hasMultiple && !isLast) || hasBelow}
      <Separator />
    {/if}
  {/each}
</ul>
