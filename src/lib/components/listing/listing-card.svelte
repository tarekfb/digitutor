<script lang="ts">
  import { Circle } from "lucide-svelte";
  import { Star } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import type { Listing } from "$lib/models/listing";

  export let listing: Listing;
</script>

<Card.Root>
  <Card.Header class="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
    <div class="space-y-1">
      <Card.Title>{listing.title}</Card.Title>
      <Card.Description>
        {#if listing.description}
        {listing.description}
        {/if}
      </Card.Description>
    </div>
  </Card.Header>
  <Card.Content>
    <div class="flex space-x-4 text-sm text-muted-foreground">
      <div class="flex items-center">
        <Circle class="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
        TypeScript
      </div>
      <div class="flex items-center">
        <Star class="mr-1 h-3 w-3" />
        15
      </div>
      <div>Skapad {listing.created_at.substring(2, 10)}</div>
    </div>
  </Card.Content>
</Card.Root>
