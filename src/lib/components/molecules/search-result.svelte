<script lang="ts">
  import { Circle } from "lucide-svelte";
  import { Star } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Terminal } from "lucide-svelte";
  import Avatar from "../atoms/avatar.svelte";

  export let listing;
</script>

<a href="/listing/{listing.id}" aria-label="Gå till annons">
  <Card.Root>
    <Card.Header>
      <Card.Title class="flex justify-between gap-x-2 items-center">
        {listing.title}
        <Avatar
          url={listing.profile.avatar_url ?? ""}
          firstName={listing.profile.firstName}
          lastName={listing.profile.lastName}
          role={listing.profile.role}
          onClick={undefined}
        />
      </Card.Title>
      <Card.Description>
        {#if listing.description}
          {listing.description}
        {/if}
      </Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="flex space-x-4 text-sm text-muted-foreground">
        <!-- <ul class="flex items-center">
          {#each listing.subjects as subject}
            <li class="flex items-center">
              <Terminal class="mr-1 h-3 w-3 text-accent" />
              {subject}
            </li>
          {/each}
        </ul> -->
        <Terminal class="mr-1 h-3 w-3 text-accent" />
        Typescript

        <p>{listing.hourly_price} SEK</p>
      </div>
    </Card.Content>
  </Card.Root>
</a>
