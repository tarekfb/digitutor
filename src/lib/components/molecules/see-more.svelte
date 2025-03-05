<script lang="ts">
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "src/lib/shared/utils/utils.ts";
  import type { Subject } from "src/lib/shared/models/subject.ts";
  import type { Variant } from "../ui/button/index.ts";

  export let subjects: number[] | Subject[];
  export let searchedSubject: number | undefined = undefined;
  export let contentStyling = "";
  export let triggerStyling = "";
  export let variant: Variant = "outline-card"
</script>

<Popover.Root portal={null}>
  <Popover.Trigger let:builder asChild >
    <Button
      {variant}
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
