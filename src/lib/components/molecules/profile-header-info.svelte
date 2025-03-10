<script lang="ts">
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
  import { cn } from "src/lib/shared/utils/utils.js";
  import type { Profile } from "src/lib/shared/models/profile.ts";
  import type { Rating } from "src/lib/shared/models/review.ts";
  import NbrOfReviews from "../atoms/nbr-of-reviews.svelte";
  import SeeMore from "./see-more.svelte";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let teacher: Profile;
  export let listing: ListingWithProfile | undefined;
  export let rating: Pick<Rating, "reviewCount" | "avgRating"> | undefined;
</script>

<div
  class={cn(
    `mt-2 flex ${listing ? "flex-col" : "flex-row justify-between flex-wrap"} gap-2 w-full `,
    className,
  )}
>
  <PrimaryTitle class="font-semibold">{teacher.firstName}</PrimaryTitle>
  <div class="flex flex-row gap-y-2 justify-between">
    <div class="flex flex-col gap-y-2">
      {#if rating}
        <div class="flex flex-col gap-y-1">
          <Stars size={5} rating={rating.avgRating} />
          <NbrOfReviews class="text-sm " nbrOfReviews={rating.reviewCount} />
        </div>
      {/if}
      {#if listing}
        <SecondaryTitle>
          {listing.hourlyPrice} SEK
        </SecondaryTitle>
      {/if}
    </div>
    {#if listing?.subjects}
      <SeeMore subjects={listing.subjects} max={3} />
    {/if}
  </div>
</div>
