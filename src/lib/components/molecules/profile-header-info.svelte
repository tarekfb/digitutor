<script lang="ts">
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import { Subjects } from "src/lib/shared/models/common";
  import { Terminal } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import type { Tables } from "src/supabase";
  import type { Listing } from "src/lib/shared/models/listing";
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let teacher: Tables<"profiles">;
  export let listing: Listing | undefined;
  export let light = false;
  export let maxSubjectsLength = 3;
</script>

<div
  class={cn(
    `mt-2 flex ${listing ? "justify-between" : "justify-center text-center"} gap-x-2 w-8/12 ${light ? "text-background" : ""}`,
    className,
  )}
>
  <div class="flex flex-col gap-y-2">
    <PrimaryTitle class="font-semibold">{teacher.first_name}</PrimaryTitle>
    <Stars rating={4.7} size={5} />
    {#if listing}
      <SecondaryTitle>
        {listing.hourly_price} SEK
      </SecondaryTitle>
    {/if}
  </div>
  {#if listing?.subjects}
    {@const subjects = listing.subjects}
    <ul class="flex flex-col gap-y-2 justify-start overflow-x-hidden">
      {#each subjects as subject, i}
        {#if i < maxSubjectsLength}
          <li class="flex gap-x-2 items-end">
            <Terminal
              class="w-5 h-5 {light ? 'text-primary' : 'text-accent'}"
            />
            <p class="font-mono text-base">{Subjects[subject]}</p>
          </li>
        {/if}
      {/each}
      {#if subjects.length > maxSubjectsLength}
        <Popover.Root portal={null}>
          <Popover.Trigger asChild let:builder>
            <Button builders={[builder]} variant="ghost" class="m-0 self-start"
              >...se {subjects.length - maxSubjectsLength} till</Button
            >
          </Popover.Trigger>
          <Popover.Content class="w-40 max-h-72 overflow-y-scroll">
            <ul class="flex flex-col gap-y-2">
              {#each subjects.splice(3) as subject, i}
                {#if i > 2}
                  <li class="flex gap-x-2 items-center">
                    <Terminal class="w-5 h-5 text-accent" />
                    <p class="font-mono text-base">
                      {Subjects[subject]}
                    </p>
                  </li>
                {/if}
              {/each}
            </ul>
          </Popover.Content>
        </Popover.Root>
      {/if}
    </ul>
  {/if}
</div>
