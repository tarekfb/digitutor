<script lang="ts">
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import SubjectItem from "src/lib/components/atoms/subject-item.svelte";
  import { Button } from "src/lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";
  import type { TopTeacher } from "src/lib/shared/models/review.ts";

  export let profile: TopTeacher;
</script>

<article class="flex flex-col gap-y-4 pb-8 px-8 ">
  <a href="/profile/{profile.id}" class="  self-center">
    <img
      alt="profile avatar w-full h-60"
      class="size-full rounded-sm object-cover"
      src={profile.avatarUrl}
    />
  </a>
  <div class="flex flex-col justify-between gap-y-4">
    <div class="flex flex-col gap-y-0.5 text-xl md:text-2xl">
      <div class="flex-l flex flex-wrap items-center justify-between gap-x-1">
        <SecondaryTitle>{profile.firstName}</SecondaryTitle>
        <Stars size={5} rating={profile.avgRating} />
      </div>
      <ul>
        {#each profile.subjects as subject, i}
          {#if i < 4}
            <SubjectItem {subject} textStyling="text-base" />
          {/if}
        {/each}
      </ul>
    </div>
    <Button on:click={() => goto(`/profile/${profile.id}`)}>Gå till profil</Button>
  </div>
</article>