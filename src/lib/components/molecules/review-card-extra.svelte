<script lang="ts">
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
  import Stars from "../atoms/stars.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";
  import { truncate as truncateFn } from "src/lib/shared/utils/utils.ts";
  import Link from "../atoms/link.svelte";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: ReviewWithReferences;
  export let truncate: number = 0;
</script>

<div
  class={cn("relative flex flex-col gap-y-2 rounded-md bg-card p-6", className)}
>
  <div class="absolute -left-3 -top-3 select-none">
    <span class="text-[120px] leading-none text-primary/40">
      <Avatar
        url={review.receiver.avatarUrl ?? ""}
        href={`/profile/${review.receiver.id}`}
        firstName={review.receiver.firstName}
        lastName={review.receiver.lastName}
        role={review.receiver.role}
        class="size-8 text-sm"
      />
    </span>
  </div>
  {#if review.description}
    <p class="overflow-hidden">
      {#if truncate}
        {@const { text, truncated } = truncateFn(review.description, truncate)}
        {text}
        {#if truncated}
          <Link href="/profile/{review.receiver.id}#{review.id}" class="whitespace-nowrap">Läs hela</Link>
        {/if}
      {:else}
        {review.description}
      {/if}
    </p>
  {/if}
  <div class="mt-4 flex flex-col gap-y-2 md:mt-6">
    {#if review.sender}
      <div class="flex items-center justify-end gap-x-2">
        <h4 class="text-muted-foreground">{review.sender.firstName}</h4>
        <Avatar
          url={review.sender.avatarUrl ?? ""}
          firstName={review.sender.firstName}
          lastName={review.sender.lastName}
          role={review.sender.role}
          class="size-6 text-xs"
          size="8"
        />
      </div>
    {/if}
    <Stars
      rating={review.rating}
      class="self-center md:self-end"
      starsStylign=" size-4 lg:size-6"
    />
  </div>
</div>
