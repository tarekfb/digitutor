<script lang="ts">
  import type { Listing } from "src/lib/shared/models/listing";
  import IsPublished from "../atoms/is-published.svelte";

  export let listing: Listing | undefined = undefined;
</script>

<small class="mt-6 flex flex-col gap-y-4 text-center px-8 mb-8 text-lg">
  <IsPublished
    isPublished={listing?.visible}
    class="self-center"
    variant="accent"
  />
  <p class="text-muted-foreground">
    Vill du göra ändringar på informationen om dig själv? <a
      href="/account/settings"
      class="underline font-mono whitespace-nowrap">Gå till din profil</a
    >
  </p>
  {#if listing}
    <p class="text-muted-foreground">
      Vill du göra ändringar på din annons? <a
        href="/account/edit-listing/{listing.id}"
        class="underline font-mono whitespace-nowrap">Gå till redigera annons</a
      >
    </p>
  {/if}
  <p class="italic text-muted-foreground">Bara du kan se detta.</p>
</small>
