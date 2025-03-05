<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import Autoplay from "embla-carousel-autoplay";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { goto } from "$app/navigation";
  import { Button } from "src/lib/components/ui/button/index.js";
  import { mediaQuery } from "svelte-legos";
  import SubjectItem from "../atoms/subject-item.svelte";
  import type { TopTeacher } from "src/lib/shared/models/review.ts";

  const isDesktop = mediaQuery("(min-width: 768px)");
  export let profiles: TopTeacher[];
</script>

{#if profiles.length > 1}
  <Carousel.Root
    class="w-5/6 max-w-xs p-2 md:max-w-md lg:max-w-lg"
    plugins={[
      Autoplay({
        delay: 3000,
      }),
    ]}
  >
    <Carousel.Content>
      {#each profiles as profile}
        {#if !$isDesktop}
          <Carousel.Item class="flex flex-col gap-y-4">
            <a href="/profile/{profile.id}" class="  self-center">
              <img
                alt="profile avatar w-full h-60"
                class="size-full rounded-sm object-cover"
                src={profile.avatarUrl}
              />
            </a>
            <div class="flex flex-col justify-between gap-y-4">
              <div class="flex flex-col gap-y-0.5 text-xl md:text-2xl">
                <div
                  class="flex-l flex flex-wrap items-center justify-between gap-x-1"
                >
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
              <Button on:click={() => goto(`/profile/${profile.id}`)}
                >Profil</Button
              >
            </div>
          </Carousel.Item>
        {:else}
          <Carousel.Item class="flex justify-evenly gap-x-4">
            <a href="/profile/{profile.id}" class="flex-shrink-0">
              <img
                alt="profile avatar"
                class="aspect-square h-60 rounded-sm object-cover"
                src={profile.avatarUrl}
              />
            </a>
            <div
              class="flex max-h-60 flex-grow-0 flex-col justify-between gap-y-4"
            >
              <div
                class="flex flex-col items-start gap-y-2 text-xl md:text-2xl"
              >
                <SecondaryTitle>{profile.firstName}</SecondaryTitle>
                <Stars size={5} rating={profile.avgRating} />
                <Button
                  on:click={() => goto(`/profile/${profile.id}`)}
                  class="md:min-w-wider">Profil</Button
                >
                <ul class="max-h-32 w-full flex-grow-0 overflow-y-auto">
                  {#each profile.subjects as subject}
                    <SubjectItem {subject} />
                  {/each}
                </ul>
              </div>
            </div>
          </Carousel.Item>
        {/if}
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>
{/if}
