<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search.ts";
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "src/lib/shared/utils/utils.ts";

  export let subjects: SearchResult["subjects"];
  export let searchedSubject: number | undefined = undefined;
  export let contentStyling = "";
  export let triggerStyling = "";
</script>

<Popover.Root portal={null}>
  <Popover.Trigger let:builder asChild>
    <Button
      variant="outline-card"
      builders={[builder]}
      class={cn("self-start", triggerStyling)}
      >se {subjects.length - 1} till</Button
    >
  </Popover.Trigger>
  <Popover.Content class={cn("max-h-72 w-40 overflow-y-auto", contentStyling)}>
    <ul class="flex flex-col gap-y-2">
      {#each subjects as subject}
        {#if subject !== searchedSubject}
          <SubjectItem {subject} muted={false} li />
        {/if}
      {/each}
    </ul>
  </Popover.Content>
</Popover.Root>
