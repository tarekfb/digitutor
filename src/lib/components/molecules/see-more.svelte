<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "src/lib/shared/utils/utils";

  export let subjects: SearchResult["subjects"];
  export let searchedSubject: number | undefined = undefined;
  export let contentStyling = "";
  export let triggerStyling = "";
</script>

<Popover.Root portal={null}>
  <Popover.Trigger let:builder asChild>
    <Button
      variant="ghost"
      builders={[builder]}
      class={cn("m-0 p-2 max-h-6 self-start", triggerStyling)}
      >...se {subjects.length - 1} till</Button
    >
  </Popover.Trigger>
  <Popover.Content class={cn("w-40 max-h-72 overflow-y-auto", contentStyling)}>
    <ul class="flex flex-col gap-y-2">
      {#each subjects as subject}
        {#if subject !== searchedSubject}
          <SubjectItem {subject} muted={false} />
        {/if}
      {/each}
    </ul>
  </Popover.Content>
</Popover.Root>
