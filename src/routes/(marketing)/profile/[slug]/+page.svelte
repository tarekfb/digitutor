<script lang="ts">
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { PageData } from "./$types";
  import AddReview from "src/lib/components/molecules/add-review.svelte";
  import ReviewCard from "src/lib/components/molecules/review-card.svelte";

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

<div class="flex flex-col gap-y-4">
  <div class="flex gap-x-2 text-2xl">
    <Avatar profile={teacher} onClick={undefined} />
    <PrimaryTitle>{teacher.first_name}</PrimaryTitle>
  </div>

  <SecondaryTitle>Annonser</SecondaryTitle>
  <div class="flex flex-col gap-y-4 my-6">
    {#each listings as listing}
      <a href="/listing/{listing.id}" aria-label="Navigate to ad">
        <ListingCard {listing} />
      </a>
    {:else}
      <p>{teacher.first_name} har inga annonser ännu.</p>
    {/each}
  </div>

  <SecondaryTitle>Recensioner</SecondaryTitle>
  {#each reviews as review}
    <ReviewCard {review} />
  {:else}
    <p>{teacher.first_name} har inga recensioner ännu.</p>
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
