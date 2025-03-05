<script lang="ts">
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import SubjectItem from "src/lib/components/atoms/subject-item.svelte";
  import type { TopTeacher } from "src/lib/shared/models/review.ts";
  import NbrOfReviews from "../atoms/nbr-of-reviews.svelte";
  import SeeMore from "./see-more.svelte";

  export let profile: TopTeacher;
</script>

<article class="flex max-w-[50vw] flex-col gap-y-2 md:max-w-full">
  <a href="/profile/{profile.id}" class=" h-40 w-full self-center">
    <img
      alt="profile avatar"
      class="size-full rounded-sm object-cover"
      src={profile.avatarUrl}
    />
  </a>
  <SecondaryTitle>{profile.firstName}</SecondaryTitle>
  <div class="flex flex-col gap-y-1">
    <Stars size={5} rating={profile.avgRating} />
    <NbrOfReviews class="text-sm " nbrOfReviews={profile.reviewCount} />
  </div>
  <ul class="flex h-full flex-col justify-between">
    {#each profile.subjects as subject, i}
      {#if i === 0}
        <SubjectItem {subject} textStyling="text-base" />
      {:else if i === 1}
        <SeeMore subjects={profile.subjects} triggerStyling="w-full" />
      {/if}
    {/each}
  </ul>
</article>
