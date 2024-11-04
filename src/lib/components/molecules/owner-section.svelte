<script lang="ts">
  import type { Listing } from "src/lib/shared/models/listing";
  import IsPublished from "../atoms/is-published.svelte";
  import { Button } from "../ui/button";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { ExternalLink } from "lucide-svelte";
  import { secondaryAltButtonVariant } from "src/lib/shared/constants/constants";

  export let listing: Listing | undefined = undefined;

  const { slug } = $page.params;
  const url = `/profile/${slug}?${listing && `id=${listing.id}`}${listing ? "&" : "?"}preview=true`;
</script>

<div class="mt-6 flex flex-col gap-y-4 items-center">
  <Button
    on:click={() => goto(url)}
    variant="secondary"
    class="flex gap-x-2 self-center items-center {secondaryAltButtonVariant()}"
    ><ExternalLink class="h-4 w-4" />visa som student</Button
  >
  <IsPublished
    isPublished={listing?.visible}
    class="self-center"
    variant="accent"
  />
  <small class="flex flex-col gap-y-4 text-center px-8 mb-8 text-lg">
    <p class="text-muted-foreground">
      Vill du göra ändringar på informationen om dig själv? <a
        href="/account/settings"
        class="underline whitespace-nowrap">Gå till din profil</a
      >
    </p>
    {#if listing}
      <p class="text-muted-foreground">
        Vill du göra ändringar på din annons? <a
          href="/account/edit-listing/{listing.id}"
          class="underline whitespace-nowrap">Gå till redigera annons</a
        >
      </p>
    {/if}
    <p class="italic text-muted-foreground">Bara du kan se detta.</p>
  </small>
</div>
