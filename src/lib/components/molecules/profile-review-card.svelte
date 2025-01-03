<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review";
  import Stars from "../atoms/stars.svelte";
  import { cn, formatDateReadable } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: ReviewWithReferences;
</script>

<li class="w-full list-none">
  <Card.Root class={cn(`w-full shadow-md`, className)}>
    <Card.Header
      class="gap-y-2 pb-4 {!review.description
        ? 'flex-row justify-between gap-x-6'
        : ''}"
    >
      <div class="flex items-center justify-between gap-x-2">
        <div class="flex items-center justify-center gap-x-2">
          <!-- if sender deleted account, sender will be null -->
          {#if review.sender}
            {@const { sender } = review}
            <Avatar
              url={sender.avatarUrl ?? ""}
              firstName={sender.firstName}
              lastName={sender.lastName}
              role={sender.role}
              class="h-8 w-8 text-sm"
            />
            <Card.Title>
              <h4 class="font-semibold">{sender.firstName}</h4>
            </Card.Title>
          {:else}
            <Card.Title>
              <h4 class="font-mono font-normal">[konto raderat]</h4>
            </Card.Title>
          {/if}
        </div>
        {#if review.description}
          <small>{formatDateReadable(review.createdAt)}</small>
        {/if}
      </div>
      <Stars rating={review.rating} size={5} />
      {#if !review.description}
        <small>{formatDateReadable(review.createdAt)}</small>
      {/if}
    </Card.Header>
    {#if review.description}
      <Card.Content class="pb-4 pt-2 text-muted-foreground">
        {review.description}
      </Card.Content>
    {/if}
  </Card.Root>
</li>
