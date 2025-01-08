<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { ListingWithProfile } from "$lib/shared/models/listing";
  import { formatDateReadable, truncate } from "src/lib/shared/utils/utils";
  import IsPublished from "../atoms/is-published.svelte";
  import { Button } from "../ui/button";
  import { Pen } from "lucide-svelte";
  import { ExternalLink } from "lucide-svelte";
  import Separator from "../ui/separator/separator.svelte";

  export let listing: ListingWithProfile;
  export let publicView = true;
</script>

<a
  href="/profile/{listing.profile.id}?id={listing.id}"
  aria-label="Gå till annons"
  class="w-full overflow-x-hidden"
>
  <Card.Root>
    <Card.Header class="flex-row items-center justify-between gap-x-2 gap-y-0">
      <Card.Title class="max-w-40 overflow-ellipsis md:max-w-96 ">
        {listing.title}
      </Card.Title>
      {#if !publicView}
        <IsPublished isPublished={listing.visible} class="text-xs" />
      {/if}
    </Card.Header>
    <Separator />
    <Card.Content
      class="md:text-md flex flex-col gap-y-4 pt-5  text-sm text-muted-foreground"
    >
      <p>
        {#if listing.description}
          {truncate(listing.description, 50)}
        {:else}
          Den här annonsen har ingen beskrivning just nu.
        {/if}
      </p>
      <div class="flex flex-col gap-y-4 md:flex-row md:justify-end md:gap-x-4">
        <Button
          href="/profile/{listing.profile.id}?id={listing.id}"
          class="flex gap-x-2 text-foreground"
          variant="outline"><ExternalLink class="h-4 w-4" />visa annons</Button
        >
        <Button href="/account/edit-listing/{listing.id}" class="flex gap-x-2">
          <Pen class="h-4 w-4" />Redigera</Button
        >
      </div>
      <div class="flex flex-col gap-y-2">
        <p>Skapad {formatDateReadable(listing.createdAt)}</p>
        {#if listing.updatedAt}
          <p>
            Uppdaterad {formatDateReadable(listing.updatedAt)}
          </p>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</a>
