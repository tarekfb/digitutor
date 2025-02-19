<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search.ts";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import Stars from "../atoms/stars.svelte";
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import Link from "../atoms/link.svelte";
  import SeeMore from "./see-more.svelte";
  import SecondaryTitle from "../atoms/secondary-title.svelte";

  const rating = 4.3;
  const nbrOfReviews = 11;
  const rowItemStyling = "flex flex-col gap-y-2 items-center";
  const boxStyling = "p-0 m-0 h-8";

  export let result: SearchResult;
  export let searchedSubject: number;
</script>

<div class="flex w-full flex-col gap-x-4 gap-y-4 overflow-x-hidden">
  {#if result.profile.avatarUrl}
    <div class="flex gap-x-4">
      <div class="flex flex-shrink-0 flex-col gap-y-2 md:gap-y-4">
        <a
          href="/profile/{result.profile.id}?id={result.id}"
          aria-label="Gå till profil"
          class="flex-shrink-0"
        >
          <img
            src={result.profile.avatarUrl}
            alt="profile avatar"
            class="size-24 rounded-md object-cover md:size-36"
          />
        </a>
        <div class="flex flex-col items-center gap-y-1">
          <h3 class="text-2xl {boxStyling}">{result.hourlyPrice} SEK</h3>
          <p class="text-muted-foreground">60 minuter</p>
        </div>
      </div>
      <div class="flex flex-grow flex-col gap-y-2">
        <Link
          href="/profile/{result.profile.id}?id={result.id}"
          class="text-foreground"
          ariaLabel="Gå till profil"
        >
          <PrimaryTitle class=" text-2xl md:text-3xl">
            {result.title}
          </PrimaryTitle>
        </Link>
        <Link
          href="/profile/{result.profile.id}?id={result.id}"
          ariaLabel="Gå till profil"
          class="text-foreground"
        >
          <SecondaryTitle class="">
            {result.profile.firstName}
          </SecondaryTitle>
        </Link>
        <div class="flex flex-col gap-y-1">
          <Stars {rating} size={4} class="m-0 p-0 " />
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
      <Button
        class="w-full self-center md:w-auto"
        href="/profile/{result.profile.id}?id={result.id}"
        >Gå till profil</Button
      >
    </div>
  {:else}
    <div class="flex flex-col gap-y-2">
      <Link
        href="/profile/{result.profile.id}?id={result.id}"
        class="text-foreground"
        ariaLabel="Gå till profil"
      >
        <PrimaryTitle class="text-2xl md:text-3xl">
          {result.title}
        </PrimaryTitle>
      </Link>
      <Link
        href="/profile/{result.profile.id}?id={result.id}"
        ariaLabel="Gå till profil"
        class="text-foreground"
      >
        <SecondaryTitle>
          {result.profile.firstName}
        </SecondaryTitle>
      </Link>
      <div class="mt-2 flex flex-col items-start gap-y-1 md:hidden">
        <Stars {rating} size={4} />
        <p class="text-muted-foreground">
          {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
        </p>
      </div>
      <div class="flex items-center justify-between gap-x-2">
        <div class="{rowItemStyling} hidden md:block">
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
          <h3 class="self-start text-2xl md:self-center {boxStyling}">
            {result.hourlyPrice} SEK
          </h3>
          <p class="text-muted-foreground">60 minuter</p>
        </div>
        <div class={rowItemStyling}>
          <SubjectItem
            subject={searchedSubject}
            muted={false}
            class="{boxStyling} gap-x-1 self-start overflow-x-hidden"
          />
          {#if result.subjects.length > 1}
            <SeeMore subjects={result.subjects} {searchedSubject} />
          {/if}
        </div>
      </div>
    </div>
    <Button
      class="w-full self-center md:w-auto"
      href="/profile/{result.profile.id}?id={result.id}">Gå till profil</Button
    >
  {/if}
</div>
