<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import SearchResultItem from "./search-result-item.svelte";
  import { Separator } from "src/lib/components/ui/separator";
  import { languages } from "src/lib/shared/models/common";

  export let results: SearchResult[];
  export let searchTerm = "";

  const hasMultiple = results.length > 1;

  const hasMatchingLabel = (subjectIndex: number): boolean => {
    const labels = getLabels(subjectIndex);
    return labels.some(
      (label) => label.toLowerCase() === searchTerm.toLowerCase(),
    );
  };

  const getLabels = (subjectIndex: number): string[] => {
    const language = languages[subjectIndex];
    const labels = [language.label, ...(language.altLabel ?? [])];
    return labels;
  };

  const getDisplaySubject = (result: SearchResult): number => {
    const defaultSubject = result.subjects[0];
    if (!searchTerm) return defaultSubject;

    const searchedSubject =
      result.subjects.find((subjectIndex) => hasMatchingLabel(subjectIndex)) ??
      result.subjects.at(0) ??
      defaultSubject;

    return searchedSubject;
  };
</script>

<ul class="flex flex-col gap-y-4 w-full">
  {#each results as result, i}
    {@const isLast = results.length - 1 === i}
    {@const hasBelow = results.length !== 1 && !isLast}
    {@const searchedSubject = getDisplaySubject(result)}
    <li class="p-4 w-full">
      <SearchResultItem {result} {searchedSubject} />
    </li>
    {#if (hasMultiple && !isLast) || hasBelow}
      <Separator />
    {/if}
  {/each}
</ul>
