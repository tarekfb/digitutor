<script lang="ts">
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { cn } from "src/lib/shared/utils/utils.ts";
  import type { Subject } from "src/lib/shared/models/subject.ts";
  import type { Variant } from "../ui/button/index.ts";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import ChevronUp from "lucide-svelte/icons/chevron-up";

  export let subjects: number[] | Subject[];
  export let contentStyling: string | null | undefined = undefined;
  export let triggerStyling: string | null | undefined = undefined;
  export let triggerTextStyling: string | null | undefined = undefined;
  export let listStyling: string | null | undefined = undefined;
  export let containerStyling: string | null | undefined = undefined;
  export let variant: Variant = "ghost-none";
  export let max: number;

  let open = false;
</script>

{#if subjects.length === 1 && max !== 0}
  <SubjectItem subject={subjects[0]} muted={false} li={false} />
{:else}
  <div class={cn("flex flex-col gap-y-2", containerStyling)}>
    <ul class={cn("flex flex-col gap-y-2", listStyling)}>
      {#each subjects as subject, i}
        {#if i < max}
          <SubjectItem {subject} muted={false} li />
        {/if}
      {/each}
    </ul>

    {#if subjects.length >= max}
      <Popover.Root portal={null} bind:open>
        <Popover.Trigger let:builder asChild class="group">
          <Button
            {variant}
            builders={[builder]}
            class={cn(
              "group m-0 h-auto justify-start gap-x-2 p-0 normal-case ",
              triggerStyling,
            )}
          >
            <div class="-ml-0.5 p-0 text-foreground {open ? 'hidden' : ''}">
              <ChevronDown class="size-5 text-accent" />
              <span class="sr-only">Öppna</span>
            </div>
            <div class="-ml-0.5 p-0 text-foreground {open ? '' : 'hidden'}">
              <ChevronUp class="size-5 text-accent" />
              <span class="sr-only">Öppna</span>
            </div>
            <span
              class={cn(
                "text-[14px] font-semibold md:text-lg",
                triggerTextStyling,
              )}>Se {subjects.length - max} språk</span
            ></Button
          >
        </Popover.Trigger>
        <Popover.Content
          class={cn("max-h-72 w-40 overflow-y-auto", contentStyling)}
        >
          <ul class={cn("flex flex-col gap-y-2", listStyling)}>
            {#each subjects as subject, i}
              {#if i >= max}
                <SubjectItem {subject} muted={false} li />
              {/if}
            {/each}
          </ul>
        </Popover.Content>
      </Popover.Root>
    {/if}
  </div>
{/if}
