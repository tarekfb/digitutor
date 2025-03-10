<script lang="ts">
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import type { TopTeacher } from "src/lib/shared/models/review.ts";
  import NbrOfReviews from "../atoms/nbr-of-reviews.svelte";
  import SeeMore from "./see-more.svelte";
  import * as Card from "$lib/components/ui/card/index.js";

  export let profile: TopTeacher;
</script>

<Card.Root>
  <Card.Content
    class="flex max-w-[50vw] flex-col gap-y-2 p-4 md:max-w-full"
  >
    <a href="/profile/{profile.id}" class=" h-40 w-full self-center">
      <img
        alt="profile avatar"
        class="size-full rounded-sm object-contain"
        src={profile.avatarUrl}
      />
    </a>
    <SecondaryTitle>{profile.firstName}</SecondaryTitle>
    <div class="flex flex-col gap-y-1">
      <Stars size={5} rating={profile.avgRating} />
      <NbrOfReviews class="text-sm " nbrOfReviews={profile.reviewCount} />
    </div>
    <SeeMore
      subjects={profile.subjects}
      triggerStyling="w-full"
      triggerTextStyling="font-normal"
    />
  </Card.Content>
</Card.Root>
