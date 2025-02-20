<script lang="ts">
  import Star from "src/lib/components/atoms/star.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { ReviewWithReferences } from "src/lib/shared/models/review.ts";
  import { cn } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let review: ReviewWithReferences;
</script>

<Card.Root>
  <Card.Header
    class={cn(`${review.description ? "pb-2" : "pb-4"} px-4 pt-4`, className)}
  >
    <div class="flex items-center justify-between gap-x-2">
      <Card.Title>
        <div class="flex items-center gap-x-2">
          {review.rating}<Star class="text-yellow-500" />
        </div>
      </Card.Title>
      {#if review.sender}
        <!-- if sender deleted account, sender will be null -->
        <div class="flex items-center gap-x-2">
          <Avatar
            url={review.sender.avatarUrl ?? ""}
            firstName={review.sender.firstName}
            role={review.sender.role}
            class="h-8 w-8 text-sm"
          />
          <h4 class="font-semibold">{review.sender.firstName}</h4>
        </div>
      {/if}
    </div>
  </Card.Header>
  {#if review.description}
    <Card.Content class="px-4 pb-4 pt-2 text-muted-foreground">
      {review.description}
    </Card.Content>
  {/if}
</Card.Root>
