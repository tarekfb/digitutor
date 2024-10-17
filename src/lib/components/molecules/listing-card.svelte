<script lang="ts">
  import { Circle } from "lucide-svelte";
  import { Star } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import type { Listing } from "$lib/shared/models/listing";

  export let listing: Listing;
  export let publicView = true;
  export let clickable = false;
</script>

{#if clickable}
  <a href="/profile/{listing.profile.id}?id={listing.id}" aria-label="Gå till annons">
    <Card.Root>
      <Card.Header>
        <Card.Title class="flex justify-between gap-x-2 items-center">
          {listing.title}
          {#if !publicView}
            <div
              class="{listing.visible
                ? 'bg-green-300'
                : 'bg-slate-100'} p-1 font-normal text-sm rounded-md self-start border-black border-solid border"
            >
              {#if listing.visible}
                Publicerad
              {:else}
                Ej publicerad
              {/if}
            </div>
          {/if}
        </Card.Title>
        <Card.Description>
          {#if listing.description}
            {listing.description}
          {/if}
        </Card.Description>
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
  </a>
{:else}
  <Card.Root>
    <Card.Header>
      <Card.Title class="flex justify-between gap-x-2 items-center">
        {listing.title}
        {#if !publicView}
          <div
            class="{listing.visible
              ? 'bg-green-300'
              : 'bg-slate-100'} p-1 font-normal text-sm rounded-md self-start border-black border-solid border"
          >
            {#if listing.visible}
              Publicerad
            {:else}
              Ej publicerad
            {/if}
          </div>
        {/if}
      </Card.Title>
      <Card.Description>
        {#if listing.description}
          {listing.description}
        {/if}
      </Card.Description>
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
{/if}
