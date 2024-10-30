<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { Listing } from "$lib/shared/models/listing";
  import { formatDateReadable, truncate } from "src/lib/utils";
  import Published from "../atoms/published.svelte";
  import { Button } from "../ui/button";
  import { Pen } from "lucide-svelte";
  import { Eye } from "lucide-svelte";
  import Separator from "../ui/separator/separator.svelte";

  export let listing: Listing;
  export let publicView = true;
</script>

<a
  href="/profile/{listing.profile.id}?id={listing.id}"
  aria-label="Gå till annons"
  class="w-full"
>
  <Card.Root>
    <Card.Header class="flex-row gap-x-2 gap-y-0 justify-between items-center">
      <Card.Title
        class="overflow-hidden overflow-ellipsis max-w-40 md:max-w-96 "
      >
        {listing.title}
      </Card.Title>
      {#if !publicView}
        <Published isPublished={listing.visible} class="" />
      {/if}
    </Card.Header>
    <Separator />
    <Card.Content
      class="pt-5 flex flex-col gap-y-4 text-muted-foreground  text-sm md:text-md"
    >
      <p>
        {#if listing.description}
          {truncate(listing.description, 50)}
        {:else}
          Den här annonsen har ingen beskrivning just nu
        {/if}
      </p>
      <div class="flex justify-evenly md:justify-end gap-x-2">
        <Button
          variant="secondary"
          href="/profile/{listing.profile.id}?id={listing.id}"
          class="flex gap-x-2"><Eye class="h-4 w-4" />SE ANNONS</Button
        >
        <Button href="/account/edit-listing/{listing.id}" class="flex gap-x-2">
          <Pen class="h-4 w-4" />Redigera</Button
        >
      </div>
      <div class="flex flex-col gap-y-2">
        <p>Skapad {formatDateReadable(listing.created_at)}</p>
        {#if listing.updated_at}
          <p>
            Uppdaterad {formatDateReadable(listing.updated_at)}
          </p>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</a>
