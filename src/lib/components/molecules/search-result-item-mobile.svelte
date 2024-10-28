<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import Stars from "../atoms/stars.svelte";
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import Link from "../atoms/link.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const rating = 4.3;
  const nbrOfReviews = 11;
  const rowItemStyling = "flex flex-col gap-y-2 items-center";
  export let result: SearchResult;
  export let searchTerm = 10;
  const searchedSubject =
    result.subjects.find((s) => s == searchTerm) ?? result.subjects.at(0);
</script>

<div class="flex flex-col gap-y-4 gap-x-4">
  {#if result.avatar}
    <div class="flex gap-x-4">
      <a
        href="/profile/{result.profile.id}?id={result.id}"
        aria-label="Gå till profil"
        class="flex-shrink-0"
      >
        <img
          src={result.avatar}
          alt="profile avatar"
          class="object-cover h-36 w-36 rounded-md"
        />
      </a>
      <div class="flex flex-col items-start gap-y-2 flex-grow">
        <a
          href="/profile/{result.profile.id}?id={result.id}"
          aria-label="Gå till profil"
        >
          <PrimaryTitle class="whitespace-normal">
            {result.profile.firstName}
          </PrimaryTitle>
        </a>
        <div class="flex flex-col gap-y-1">
          <Stars {rating} size={4} class="p-0 m-0 " />
          <p class="text-muted-foreground">
            {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
          </p>
        </div>
        <div class="flex flex-col">
          <SubjectItem
            subject={searchedSubject}
            muted={false}
            class="p-0 m-0 h-8 gap-x-1 overflow-x-hidden"
          />

          {#if result.subjects.length > 1}
            <Popover.Root portal={null}>
              <Popover.Trigger let:builder asChild>
                <Button
                  variant="secondary"
                  builders={[builder]}
                  class="m-0 p-2 max-h-6 self-start "
                  >...se {result.subjects.length - 1} till</Button
                >
              </Popover.Trigger>
              <Popover.Content class="w-40 max-h-72 overflow-y-auto">
                <ul class="flex flex-col gap-y-2">
                  {#each result.subjects as subject}
                    {#if subject !== searchedSubject}
                      <SubjectItem {subject} muted={false} />
                    {/if}
                  {/each}
                </ul>
              </Popover.Content>
            </Popover.Root>
          {/if}
        </div>
      </div>
    </div>
    <div class="flex justify-evenly">
      <div class="flex flex-col gap-y-2 items-center">
        <h3 class="text-2xl p-0 m-0 h-8">{result.hourlyPrice} SEK</h3>
        <p class="text-muted-foreground">60 minuter</p>
      </div>
      <Button
        class="self-center"
        href="/profile/{result.profile.id}?id={result.id}"
        >Gå till profil</Button
      >
    </div>
  {:else}
    <div class="flex flex-col">
      <Link
        class="text-foreground self-start"
        href="/profile/{result.profile.id}?id={result.id}"
      >
        <PrimaryTitle class="whitespace-normal">
          {result.profile.firstName}
        </PrimaryTitle>
      </Link>
      <div class="flex justify-between items-center gap-x-2">
        <div class={rowItemStyling}>
          <Stars {rating} size={4} class="p-0 m-0 h-8 items-center " />
          <p class="text-muted-foreground">
            {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
          </p>
        </div>
        <div class={rowItemStyling}>
          <h3 class="text-2xl p-0 m-0 h-8">{result.hourlyPrice} SEK</h3>
          <p class="text-muted-foreground">60 minuter</p>
        </div>
        <div class={rowItemStyling}>
          <SubjectItem
            subject={searchedSubject}
            muted={false}
            class="p-0 m-0 h-8 gap-x-1 overflow-x-hidden self-start"
          />
          {#if result.subjects.length > 1}
            <Popover.Root portal={null}>
              <Popover.Trigger asChild let:builder>
                <Button
                  variant="secondary"
                  builders={[builder]}
                  class="m-0 p-2 max-h-6 self-start "
                  >...se {result.subjects.length - 1} till</Button
                >
              </Popover.Trigger>
              <Popover.Content class="w-40 max-h-72 overflow-y-scroll">
                <ul class="flex flex-col gap-y-2">
                  {#each result.subjects as subject}
                    {#if subject !== searchedSubject}
                      <SubjectItem {subject} muted={false} />
                    {/if}
                  {/each}
                </ul>
              </Popover.Content>
            </Popover.Root>
          {/if}
        </div>
      </div>
    </div>
    <Button
      class="self-center"
      href="/profile/{result.profile.id}?id={result.id}">Gå till profil</Button
    >
  {/if}
</div>
