<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import Stars from "../atoms/stars.svelte";
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import Link from "../atoms/link.svelte";
  import SeeMore from "./see-more.svelte";
  import { languages } from "src/lib/shared/models/common";

  const rating = 4.3;
  const nbrOfReviews = 11;
  const rowItemStyling = "flex flex-col gap-y-2 items-center";
  const boxStyling = "p-0 m-0 h-8";

  export let result: SearchResult;
  export let searchedSubject: number;
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
            class="{boxStyling} gap-x-1 overflow-x-hidden"
          />
          {#if result.subjects.length > 1}
            <SeeMore subjects={result.subjects} {searchedSubject} />
          {/if}
        </div>
      </div>
    </div>
    <div class="flex justify-evenly">
      <div class="flex flex-col gap-y-1 items-center">
        <h3 class="text-2xl {boxStyling}">{result.hourlyPrice} SEK</h3>
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
          <Stars
            {rating}
            size={4}
            class="{boxStyling} items-center self-start "
          />
          <p class="text-muted-foreground">
            {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
          </p>
        </div>
        <div class={rowItemStyling}>
          <h3 class="text-2xl {boxStyling}">{result.hourlyPrice} SEK</h3>
          <p class="text-muted-foreground">60 minuter</p>
        </div>
        <div class={rowItemStyling}>
          <SubjectItem
            subject={searchedSubject}
            muted={false}
            class="{boxStyling} gap-x-1 overflow-x-hidden self-start"
          />
          {#if result.subjects.length > 1}
            <SeeMore subjects={result.subjects} {searchedSubject} />
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
