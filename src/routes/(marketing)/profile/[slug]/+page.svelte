<script lang="ts">
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { PageData } from "./$types";
  import AddReview from "src/lib/components/molecules/add-review.svelte";
  import ReviewCard from "src/lib/components/molecules/review-card.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import AvatarNameBar from "src/lib/components/organisms/avatar-name-bar.svelte";
  import { mediaQuery } from "svelte-legos";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import RootContainer from "src/lib/components/molecules/root-container.svelte";
  import { Subjects } from "src/lib/shared/models/common";
  import { Terminal } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  export let data: PageData;
  $: ({
    teacher,
    listing,
    session,
    requestContactForm,
    startContactForm,
    addReviewForm,
    reviews,
    allowCreateReview,
  } = data);

  const isDesktop = mediaQuery("(min-width: 768px)");

  const maxSubjectsLength = 3;
</script>

{#if !$isDesktop}
  <RootContainer class="w-full m-0">
    <!-- this div creates some height to wavy background -->
    <div class="-mt-8 h-28 w-screen bg-accent"></div>

    <svg class="fill-current text-accent -mx-8 -mt-8" viewBox="0 0 900 100"
      ><path
        d="M0 51L10 51.5C20 52 40 53 60 58.2C80 63.3 100 72.7 120 72.7C140 72.7 160 63.3 180 57C200 50.7 220 47.3 240 49.8C260 52.3 280 60.7 300 62.2C320 63.7 340 58.3 360 58.3C380 58.3 400 63.7 420 61.5C440 59.3 460 49.7 480 50.7C500 51.7 520 63.3 540 68.5C560 73.7 580 72.3 600 73.5C620 74.7 640 78.3 660 77.3C680 76.3 700 70.7 720 65.5C740 60.3 760 55.7 780 58.2C800 60.7 820 70.3 840 73.8C860 77.3 880 74.7 890 73.3L900 72L900 0L890 0C880 0 860 0 840 0C820 0 800 0 780 0C760 0 740 0 720 0C700 0 680 0 660 0C640 0 620 0 600 0C580 0 560 0 540 0C520 0 500 0 480 0C460 0 440 0 420 0C400 0 380 0 360 0C340 0 320 0 300 0C280 0 260 0 240 0C220 0 200 0 180 0C160 0 140 0 120 0C100 0 80 0 60 0C40 0 20 0 10 0L0 0Z"
      /></svg
    >
    {#if teacher.avatar_url}
      <div class="flex flex-col gap-y-4 items-center w-full">
        <img
          src={teacher.avatar_url}
          alt="profile avatar"
          class="object-cover w-max h-60 -mt-28"
        />
        <div class="flex justify-between gap-x-2 w-8/12">
          <div class="flex flex-col gap-y-2">
            <PrimaryTitle class="font-semibold"
              >{teacher.first_name}</PrimaryTitle
            >
            <Stars rating={4.7} size={5} />
            <SecondaryTitle>
              {#if listing}
                {listing.hourly_price} SEK
              {/if}
            </SecondaryTitle>
          </div>
          {#if listing?.subjects}
            {@const subjects = listing.subjects}
            <ul class="flex flex-col gap-y-2 justify-center overflow-x-hidden">
              {#each subjects as subject, i}
                {#if i < maxSubjectsLength}
                  <li class="flex gap-x-2 items-end">
                    <Terminal class="w-5 h-5 text-accent" />
                    <p class="font-mono text-base">{Subjects[subject]}</p>
                  </li>
                {/if}
              {/each}
              {#if subjects.length > maxSubjectsLength}
                <Popover.Root portal={null}>
                  <Popover.Trigger asChild let:builder>
                    <Button
                      builders={[builder]}
                      variant="ghost"
                      class="m-0 self-start"
                      >...se {subjects.length - maxSubjectsLength} till</Button
                    >
                  </Popover.Trigger>
                  <Popover.Content class="w-40 max-h-72 overflow-y-scroll">
                    <ul class="flex flex-col gap-y-2">
                      {#each subjects.splice(3) as subject, i}
                        {#if i > 2}
                          <li class="flex gap-x-2 items-end">
                            <Terminal class="w-5 h-5 text-accent" />
                            <p class="font-mono text-base">
                              {Subjects[subject]}
                            </p>
                          </li>
                        {/if}
                      {/each}
                    </ul>
                  </Popover.Content>
                </Popover.Root>
              {/if}
            </ul>
          {:else}
            Behöver fixa om man inte har bild
          {/if}
        </div>
        <ContactTeacherForm
          {requestContactForm}
          {startContactForm}
          requestContactAction="?/requestContact"
          startContactAction="?/startContact"
          firstName={teacher.first_name}
          buttonStyling="self-end"
        />
      </div>
    {/if}
    <div class="flex flex-col gap-y-4 my-4">
      {#if listing}
        <div class="flex flex-col items-center gap-y-4 px-8">
          <PrimaryTitle class="text-wrap">{listing.title}</PrimaryTitle>
          <p>
            {#if listing.description}
              {listing.description}
            {:else}
              Den här annonsen har ingen beskrivning just nu.
            {/if}
          </p>
        </div>
      {/if}
      <div class="flex flex-col items-center gap-y-4 px-8">
        <PrimaryTitle class="text-wrap">Om mig</PrimaryTitle>
        <p>
          <!-- {#if profile.bio}
          {profile.bio}
        {:else}
          Den här läraren har ingen beskrivning just nu.
        {/if} -->
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat
          aliquet porta. Fusce sagittis blandit porttitor. Proin sed lacus eget dolor
          dignissim luctus. In congue fermentum orci, eu cursus lacus rhoncus et.
          Nunc id magna at orci suscipit bibendum sit amet ut augue. Ut ac nisl neque.
          Quisque eget luctus lectus. Pellentesque ac volutpat tellus. Cras risus
          massa, eleifend vel diam et, rutrum volutpat sapien. In rhoncus nisl ut
          libero placerat porta.
        </p>
      </div>
      <div class="flex flex-col items-center gap-y-4 px-8 w-full">
        <PrimaryTitle class="text-wrap">Recensioner</PrimaryTitle>
        {#each reviews as review}
          <ReviewCard {review} />
        {:else}
          <p class="text-center">
            {teacher.first_name} har inga recensioner ännu.
          </p>
        {/each}
        {#if allowCreateReview}
          <AddReview form={addReviewForm} {teacher} />
        {/if}
      </div>

      {#if session?.user.id === teacher.id}
        <small
          class="mt-12 flex flex-col gap-y-2 text-center text-muted-foreground"
        >
          <span>
            Vill du göra ändringar? <a href="/account" class="underline"
              >Gå till din profil.</a
            >
          </span>
          <span>Bara du kan se detta.</span>
        </small>
      {/if}
    </div>
  </RootContainer>
{:else}
  <!-- else content here -->
{/if}
<!-- 
<div class="flex flex-col gap-y-4 pb-8 w-full max-w-[1000px]">
  {#if teacher.avatar_url}
    <PrimaryTitle>Profil: {teacher.first_name}</PrimaryTitle>
    <img
      src={teacher.avatar_url}
      alt="profile avatar"
      class="object-cover w-max"
    />
  {:else}
    <AvatarNameBar profile={teacher}>
      <PrimaryTitle>Profil: {teacher.first_name}</PrimaryTitle>
    </AvatarNameBar>
  {/if}

  <SecondaryTitle>Annonser</SecondaryTitle>
  <div class="flex flex-col gap-y-4 my-6">
    {#each listings as listing}
      <ListingCard {listing} publicView={false} clickable />
    {:else}
      <p class="text-center">{teacher.first_name} har inga annonser ännu.</p>
    {/each}
  </div>

  <SecondaryTitle>Recensioner</SecondaryTitle>
  {#each reviews as review}
    <ReviewCard {review} />
  {:else}
    <p class="text-center">{teacher.first_name} har inga recensioner ännu.</p>
  {/each}
  {#if allowCreateReview}
    <AddReview form={addReviewForm} {teacher} />
  {/if}

  <ContactTeacherForm
    {requestContactForm}
    {startContactForm}
    requestContactAction="?/requestContact"
    startContactAction="?/startContact"
    firstName={teacher.first_name}
    buttonStyling="self-end"
  />

  {#if session?.user.id === teacher.id}
    <small
      class="mt-12 flex flex-col gap-y-2 text-center text-muted-foreground"
    >
      <span>
        Vill du göra ändringar? <a href="/account" class="underline"
          >Gå till din profil.</a
        >
      </span>
      <span>Bara du kan se detta.</span>
    </small>
  {/if}
</div> -->
