<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  // import SearchResultItem from "./search-result-item.svelte";
  import SearchResultItemTemp from "./search-result-item-mobile.svelte";
  import type {
    requestContactSchema,
    startContactSchema,
  } from "src/lib/shared/models/conversation";
  import type { Infer } from "sveltekit-superforms";
  import type { SuperValidated } from "sveltekit-superforms/client";
  export let results: SearchResult[];
  export let requestContactForm: SuperValidated<
    Infer<typeof requestContactSchema>
  >;
  export let startContactForm: SuperValidated<Infer<typeof startContactSchema>>;
</script>

<ul class="flex flex-col gap-y-4 w-full">
  {#each results as result}
    <li>
      <SearchResultItemTemp {result} {requestContactForm} {startContactForm} />
    </li>
  {/each}
</ul>
