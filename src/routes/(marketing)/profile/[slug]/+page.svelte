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
  import ProfileHeaderMobile from "src/lib/components/organisms/profile-header-mobile.svelte";

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
</script>

{#if !$isDesktop}
  <RootContainer class="w-full m-0">
    <ProfileHeaderMobile
      {teacher}
      {listing}
      {requestContactForm}
      {startContactForm}
    />
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
          class="mt-6 flex flex-col gap-y-2 text-center text-muted-foreground px-8 text-lg"
        >
          <p>
            Vill du göra ändringar på informationen om dig? <a
              href="/account"
              class="underline">Gå till din profil.</a
            >
          </p>
          {#if listing}
            <p>
              Vill du göra ändringar på din annons? <a
                href="/listing/{listing.id}"
                class="underline">Gå till annonsen.</a
              >
            </p>
          {/if}
          <p class="italic">Bara du kan se detta.</p>
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
