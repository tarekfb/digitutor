<script lang="ts">
  import AddReview from "src/lib/components/molecules/add-review.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ProfileReviewCard from "src/lib/components/molecules/profile-review-card.svelte";
  import type {
    addReviewSchema,
    ReviewWithReferences,
  } from "src/lib/shared/models/review";
  import type { SuperValidated, Infer } from "sveltekit-superforms/client";
  import { cn } from "src/lib/shared/utils/utils";
  import type { Profile } from "src/lib/shared/models/profile";

  export let pStyle: string | null | undefined = undefined;
  export let reviews: ReviewWithReferences[];
  export let allowCreateReview: boolean;
  export let teacher: Profile;
  export let addReviewForm: SuperValidated<Infer<typeof addReviewSchema>>;
</script>

<PrimaryTitle class="text-wrap">Om {teacher.firstName}</PrimaryTitle>
<p class={cn("text-muted-foreground md:text-lg", pStyle)}>
  <!-- {#if profile.bio}
          {profile.bio}
        {:else}
          Den här läraren har ingen beskrivning just nu.
        {/if} -->
  Den här läraren har ingen beskrivning just nu.
</p>
<PrimaryTitle class="text-wrap">Recensioner</PrimaryTitle>
{#if allowCreateReview}
  <AddReview form={addReviewForm} {teacher} />
{/if}
{#if reviews.length > 0}
  <ul class="flex flex-col items-center gap-y-4">
    {#each reviews as review}
      <ProfileReviewCard {review} />
    {/each}
  </ul>
{:else}
  <p class={cn("text-muted-foreground", pStyle)}>
    {teacher.firstName} har inga recensioner ännu.
  </p>
{/if}
