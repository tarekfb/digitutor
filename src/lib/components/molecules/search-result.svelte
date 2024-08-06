<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Terminal } from "lucide-svelte";
  import Avatar from "../atoms/avatar.svelte";
  import type { SearchResult } from "src/lib/shared/models/search";
  import { truncate } from "src/lib/utils";

  export let listing: SearchResult;
</script>

<a href="/listing/{listing.id}" aria-label="Gå till annons">
  <Card.Root>
    <Card.Header>
      <Card.Title class="flex justify-between gap-x-2 items-center">
        {listing.title}
        <Avatar
          url={listing.avatar ?? ""}
          firstName={listing.firstName}
          lastName={listing.lastName}
          onClick={undefined}
        />
      </Card.Title>
      {#if listing.description}
        <Card.Description>
          {truncate(listing.description, 10)}
        </Card.Description>
      {/if}
    </Card.Header>
    <Card.Content
      class="flex justify-between space-x-4 text-sm text-muted-foreground"
    >
      <!-- <ul class="flex items-center">
          {#each listing.subjects as subject}
            <li class="flex items-center">
              <Terminal class="mr-1 h-3 w-3 text-accent" />
              {subject}
            </li>
          {/each}
        </ul> -->
      <span class="flex items-center">
        <Terminal class="mr-1 h-3 w-3 text-accent" />
        Typescript
      </span>
      <p>{listing.hourlyPrice} SEK</p>
      <p>{listing.firstName}</p>
    </Card.Content>
  </Card.Root>
</a>
