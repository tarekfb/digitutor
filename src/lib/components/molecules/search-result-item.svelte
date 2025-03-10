<script lang="ts">
  import type { SearchResult } from "src/lib/shared/models/search.ts";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import Stars from "../atoms/stars.svelte";
  import Button from "../ui/button/button.svelte";
  import Link from "../atoms/link.svelte";
  import SeeMore from "./see-more.svelte";
  import SecondaryTitle from "../atoms/secondary-title.svelte";
  import NbrOfReviews from "../atoms/nbr-of-reviews.svelte";
  import ArrowRight from "lucide-svelte/icons/arrow-right";

  const boxStyling = "p-0 m-0 h-8";
  const maxWidth = "max-w-full md:max-w-screen-sm lg:max-w-screen-md";

  export let result: SearchResult;
  export let searchedSubject: number;
</script>

<div class="flex w-full flex-col gap-y-4 overflow-x-hidden {maxWidth} ">
  <div class="flex gap-x-2 md:gap-x-4">
    {#if result.profile.avatarUrl}
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
    {/if}
    <div class="flex flex-grow flex-col gap-y-2">
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
        <SecondaryTitle class="">
          {result.profile.firstName}
        </SecondaryTitle>
      </Link>
    </div>
  </div>
  <div class="flex items-center justify-between gap-x-4 md:gap-x-8">
    <div class="flex flex-col gap-y-1">
      {#if result.reviewCount > 0}
        <Stars rating={result.avgRating} size={4} class="m-0 p-0 " />
        <NbrOfReviews nbrOfReviews={result.reviewCount} />
      {:else}
        <p>Ny lärare</p>
      {/if}
    </div>
    <div class="flex flex-col items-center gap-y-1">
      <h3 class="text-2xl {boxStyling}">{result.hourlyPrice} SEK</h3>
      <p class="text-muted-foreground">60 minuter</p>
    </div>
    <SeeMore
      subjects={result.subjects.includes(searchedSubject)
        ? [searchedSubject]
        : result.subjects}
      max={1}
    />
  </div>
  <div class="flex justify-evenly">
    <Button
      class="icon-button wide-button self-center"
      href="/profile/{result.profile.id}?id={result.id}"
      >Gå till profil
      <ArrowRight class="size-button-icon" />
    </Button>
  </div>
  <!-- {:else}
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
        {#if result.reviewCount > 0}
          <Stars rating={result.avgRating} size={4} />
          <NbrOfReviews nbrOfReviews={result.reviewCount} />
        {:else}
          <p>Ny lärare</p>
        {/if}
      </div>

      <div class="flex items-center justify-between gap-x-2">
        <div class="{rowItemStyling} hidden md:block">
          {#if result.reviewCount > 0}
            <Stars
              rating={result.avgRating}
              size={4}
              class="{boxStyling} items-center self-start "
            />
            <NbrOfReviews nbrOfReviews={result.reviewCount} />
          {:else}
            <p>Ny lärare</p>
          {/if}
        </div>
        <div class={rowItemStyling}>
          <h3 class="self-start text-2xl md:self-center {boxStyling}">
            {result.hourlyPrice} SEK
          </h3>
          <p class="text-muted-foreground">60 minuter</p>
        </div>
        <SeeMore
          subjects={result.subjects.includes(searchedSubject)
            ? [searchedSubject]
            : result.subjects}
          max={1}
        />
      </div>
    </div>
    <Button
      class="icon-button wide-button self-center"
      href="/profile/{result.profile.id}?id={result.id}"
      >Gå till profil
      <ArrowRight class="size-button-icon" />
    </Button> -->
</div>
