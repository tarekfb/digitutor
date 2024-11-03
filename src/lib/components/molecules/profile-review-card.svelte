<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { Review } from "src/lib/shared/models/review";

  import { cn, formatDateReadable } from "src/lib/shared/utils/utils.js";
  import Stars from "../atoms/stars.svelte";
  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: Review;
</script>

<li class="list-none w-full">
  <Card.Root class={cn(`shadow-md w-full`, className)}>
    <Card.Header
      class="gap-y-2 pb-4 {!review.description
        ? 'flex-row justify-between gap-x-6'
        : ''}"
    >
      <div class="flex gap-x-2 justify-between items-center">
        <div class="flex gap-x-2 items-center justify-center">
          <!-- if sender deleted account, sender will be null -->
          {#if review.sender}
            <Avatar
              url={review.sender.avatar_url ?? ""}
              firstName={review.sender.first_name}
              lastName={review.sender.last_name}
              role={review.sender.role}
              onClick={undefined}
              class="text-sm w-8 h-8"
            />
            <Card.Title>
              <h4 class="font-semibold">{review.sender.first_name}</h4>
            </Card.Title>
          {:else}
            <Card.Title>
              <h4 class="font-normal font-mono">[konto raderat]</h4>
            </Card.Title>
          {/if}
        </div>
        {#if review.description}
          <small>{formatDateReadable(review.created_at)}</small>
        {/if}
      </div>
      <Stars rating={review.rating} size={5} />
      {#if !review.description}
        <small>{formatDateReadable(review.created_at)}</small>
      {/if}
    </Card.Header>
    {#if review.description}
      <Card.Content class="text-muted-foreground pt-2 pb-4">
        {review.description}
      </Card.Content>
    {/if}
  </Card.Root>
</li>
