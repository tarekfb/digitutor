<script lang="ts">
  import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
  import IsPublished from "../atoms/is-published.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import ExternalLink from "lucide-svelte/icons/external-link";

  export let listing: ListingWithProfile | undefined = undefined;

  const { slug } = $page.params;
  const url = `/profile/${slug}?${listing && `id=${listing.id}`}${listing ? "&" : "?"}preview=true`;
</script>

<div class="mt-6 flex flex-col items-center gap-y-4">
  <Button
    on:click={() => goto(url)}
    variant="outline"
    class="flex items-center gap-x-2 self-center bg-card"
    ><ExternalLink class="h-4 w-4" />visa som student</Button
  >
  <IsPublished
    isPublished={listing?.visible}
    class="self-center"
    variant="accent"
  />
  <small class="mb-8 flex flex-col gap-y-4 px-8 text-center text-lg">
    <p class="text-muted-foreground">
      Vill du göra ändringar på informationen om dig själv? <a
        href="/account/settings"
        class="whitespace-nowrap underline">Gå till din profil</a
      >
    </p>
    {#if listing}
      <p class="text-muted-foreground">
        Vill du göra ändringar på din annons? <a
          href="/account/edit-listing/{listing.id}"
          class="whitespace-nowrap underline">Gå till redigera annons</a
        >
      </p>
    {/if}
    <p class="italic text-muted-foreground">Bara du kan se detta.</p>
  </small>
</div>
