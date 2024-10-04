<script lang="ts">
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { PageData } from "./$types";
  import AddReview from "src/lib/components/molecules/add-review.svelte";
  import ReviewCard from "src/lib/components/molecules/review-card.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import AvatarNameBar from "src/lib/components/organisms/avatar-name-bar.svelte";

  export let data: PageData;
  $: ({
    teacher,
    listings,
    session,
    requestContactForm,
    startContactForm,
    addReviewForm,
    reviews,
    allowCreateReview,
  } = data);
</script>

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
</div>
