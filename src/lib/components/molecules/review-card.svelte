<script lang="ts">
  import Star from "src/lib/components/atoms/star.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import type { Review } from "src/lib/shared/models/review";

  export let review: Review;
</script>

<Card.Root>
  <Card.Header class="{review.description ? 'pb-2' : 'pb-4'} pt-4 px-4">
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
            profile={review.sender}
            onClick={undefined}
            class="text-sm w-8 h-8"
          />
          <h4 class="font-semibold">{review.sender.first_name}</h4>
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
