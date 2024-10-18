<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Terminal } from "lucide-svelte";
  import Avatar from "../atoms/avatar.svelte";
  import type { SearchResult } from "src/lib/shared/models/search";
  import { truncate } from "src/lib/utils";

  export let result: SearchResult;
</script>

<a href="/profile/{result.profile.id}?id={result.id}" aria-label="Gå till annons">
  <Card.Root>
    <Card.Header>
      <Card.Title class="flex justify-between gap-x-2 items-center">
        {result.title}
        <Avatar
          url={result.avatar ?? ""}
          firstName={result.firstName}
          lastName={result.lastName}
          onClick={undefined}
        />
      </Card.Title>
      {#if result.description}
        <Card.Description>
          {truncate(result.description, 10)}
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
      <p>{result.hourlyPrice} SEK</p>
      <p>{result.firstName}</p>
    </Card.Content>
  </Card.Root>
</a>
