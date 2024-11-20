<script lang="ts">
  import Star from "src/lib/components/atoms/star.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review";
  import { cn } from "src/lib/shared/utils/utils.js";
  
  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: ReviewWithReferences;
</script>

<Card.Root>
  <Card.Header
    class={cn(`${review.description ? "pb-2" : "pb-4"} pt-4 px-4`, className)}
  >
    <div class="flex gap-x-2 justify-between items-center">
      <Card.Title>
        <div class="flex gap-x-2 items-center">
          {review.rating}<Star class="text-yellow-500" />
        </div>
      </Card.Title>
      {#if review.sender}
        <!-- if sender deleted account, sender will be null -->
        <div class="flex gap-x-2 items-center">
          <Avatar
            url={review.sender.avatarUrl ?? ""}
            firstName={review.sender.firstName}
            lastName={review.sender.lastName}
            role={review.sender.role}
            class="text-sm w-8 h-8"
          />
          <h4 class="font-semibold">{review.sender.firstName}</h4>
        </div>
      {/if}
    </div>
  </Card.Header>
  {#if review.description}
    <Card.Content class="text-muted-foreground pt-2 pb-4 px-4">
      {review.description}
    </Card.Content>
  {/if}
</Card.Root>
