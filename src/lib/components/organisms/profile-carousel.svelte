<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import Autoplay from "embla-carousel-autoplay";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { goto } from "$app/navigation";
  import { Button } from "src/lib/components/ui/button";
  import { mediaQuery } from "svelte-legos";
  import { Subjects } from "src/lib/shared/models/common";
  import { Terminal } from "lucide-svelte";
  import type { DisplayProfile } from "src/lib/shared/models/review";

  const isDesktop = mediaQuery("(min-width: 768px)");
  export let profiles: DisplayProfile[];
</script>

{#if profiles.length > 1}
  <Carousel.Root
    class="w-5/6 max-w-xs md:max-w-md p-2"
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
            <a href="/profile/{profile.id}" class="h-full w-full">
              <img
                alt="profile avatar"
                class="rounded-sm object-cover h-full w-full"
                src={profile.avatarUrl}
              />
            </a>
            <div class="flex flex-col justify-between gap-y-4">
              <div
                class="flex flex-col gap-y-0.5 text-muted-foreground text-xl md:text-2xl"
              >
                <div class="flex justify-between gap-x-1 flex-l flex-wrap">
                  <SecondaryTitle class="font-semibold"
                    >{profile.firstName}</SecondaryTitle
                  >
                  <Stars size={5} rating={profile.avgRating} />
                </div>
                <ul>
                  {#each profile.subjects as subject, i}
                    {#if i < 4}
                      <li class="flex gap-x-2 items-end">
                        <Terminal class="w-5 h-5 text-accent" />
                        <p class="font-mono text-base">{Subjects[subject]}</p>
                      </li>
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
            <a href="/profile/{profile.id}" class="h-full w-full">
              <img
                alt="profile avatar"
                class="rounded-sm object-cover h-full w-full"
                src={profile.avatarUrl}
              />
            </a>
            <div class="flex flex-col justify-between gap-y-4">
              <div
                class="flex flex-col gap-y-0.5 text-muted-foreground text-xl md:text-2xl"
              >
                <SecondaryTitle class=" font-semibold"
                  >{profile.firstName}</SecondaryTitle
                >
                <Stars size={5} rating={profile.avgRating} />
                <ul>
                  {#each profile.subjects as subject, i}
                    {#if i < 6}
                      <li class="flex gap-x-2 items-end">
                        <Terminal class="w-5 h-5 text-accent" />
                        <p class="font-mono text-base">{Subjects[subject]}</p>
                      </li>
                    {/if}
                  {/each}
                </ul>
              </div>
              <Button
                on:click={() => goto(`/profile/${profile.id}`)}
                class="md:min-w-wider">Profil</Button
              >
            </div>
          </Carousel.Item>
        {/if}
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>
{/if}
