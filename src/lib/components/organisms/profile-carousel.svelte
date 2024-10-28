<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import Autoplay from "embla-carousel-autoplay";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { goto } from "$app/navigation";
  import { Button } from "src/lib/components/ui/button";
  import { mediaQuery } from "svelte-legos";
  import type { DisplayProfile } from "src/lib/shared/models/review";
  import SubjectItem from "../atoms/subject-item.svelte";

  const isDesktop = mediaQuery("(min-width: 768px)");
  export let profiles: DisplayProfile[];
</script>

{#if profiles.length > 1}
  <Carousel.Root
    class="w-5/6 max-w-xs md:max-w-md lg:max-w-lg p-2"
    plugins={[
      Autoplay({
        delay: 3000,
      }),
    ]}
  >
    <Carousel.Content>
      {#each profiles as profile}
        {#if !$isDesktop}
          <Carousel.Item class="flex flex-col start gap-y-4">
            <a href="/profile/{profile.id}" class="self-center">
              <img
                alt="profile avatar"
                class="rounded-sm object-cover w-60 h-60"
                src={profile.avatarUrl}
              />
            </a>
            <div class="flex flex-col justify-between gap-y-4">
              <div class="flex flex-col gap-y-0.5 text-xl md:text-2xl">
                <div
                  class="flex justify-between items-center gap-x-1 flex-l flex-wrap"
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
          <Carousel.Item class="flex justify-evenly gap-x-4 ">
            <a href="/profile/{profile.id}" class="flex-shrink-0">
              <img
                alt="profile avatar"
                class="rounded-sm object-cover h-60 aspect-square"
                src={profile.avatarUrl}
              />
            </a>
            <div
              class="flex flex-col justify-between gap-y-4 max-h-60 flex-grow-0"
            >
              <div
                class="flex flex-col gap-y-2 text-xl md:text-2xl items-start"
              >
                <SecondaryTitle>{profile.firstName}</SecondaryTitle>
                <Stars size={5} rating={profile.avgRating} />
                <Button
                  on:click={() => goto(`/profile/${profile.id}`)}
                  class="md:min-w-wider">Profil</Button
                >
                <ul class="max-h-32 overflow-y-auto flex-grow-0 w-full">
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
