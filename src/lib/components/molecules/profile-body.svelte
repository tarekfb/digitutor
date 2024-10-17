<script lang="ts">
  import AddReview from "src/lib/components/molecules/add-review.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ProfileReviewCard from "src/lib/components/molecules/profile-review-card.svelte";
  import type { Review } from "src/lib/shared/models/review";
  import type { SuperValidated } from "sveltekit-superforms/client";
  import type { Tables } from "src/supabase";
  import { cn } from "src/lib/utils";

  export let pStyle: string | null | undefined = undefined;
  export let reviews: Review[];
  export let allowCreateReview: boolean;
  export let teacher: Tables<"profiles">;
  export let addReviewForm: SuperValidated<any, any, any>;
</script>

<PrimaryTitle class="text-wrap">Om mig</PrimaryTitle>
<p class={cn("text-muted-foreground", pStyle)}>
  <!-- {#if profile.bio}
          {profile.bio}
        {:else}
          Den här läraren har ingen beskrivning just nu.
        {/if} -->
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat aliquet
  porta. Fusce sagittis blandit porttitor. Proin sed lacus eget dolor dignissim luctus.
  In congue fermentum orci, eu cursus lacus rhoncus et. Nunc id magna at orci suscipit
  bibendum sit amet ut augue. Ut ac nisl neque. Quisque eget luctus lectus. Pellentesque
  ac volutpat tellus. Cras risus massa, eleifend vel diam et, rutrum volutpat sapien.
  In rhoncus nisl ut libero placerat porta.
</p>
<PrimaryTitle class="text-wrap">Recensioner</PrimaryTitle>
{#if reviews.length > 0}
  <ul class="flex flex-col items-center gap-y-4">
    {#each reviews as review}
      <ProfileReviewCard {review} />
    {/each}
  </ul>
{:else}
  <p class={cn("text-muted-foreground", pStyle)}>
    {teacher.first_name} har inga recensioner ännu.
  </p>
{/if}
{#if allowCreateReview}
  <AddReview form={addReviewForm} {teacher} />
{/if}
