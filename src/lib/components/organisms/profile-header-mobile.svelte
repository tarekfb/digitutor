<script lang="ts">
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
  import type { SuperValidated, Infer } from "sveltekit-superforms/client";
  import ProfileHeaderInfo from "$lib/components/molecules/profile-header-info.svelte";
  import Wavy from "$lib/components/atoms/wavy.svelte";
  import {
    requestContactSchema,
    startContactSchema,
  } from "src/lib/shared/models/conversation.ts";
  import type { Profile } from "src/lib/shared/models/profile.ts";

  export let teacher: Profile;
  export let listing: ListingWithProfile | undefined;
  export let requestContactForm: SuperValidated<
    Infer<typeof requestContactSchema>
  >;
  export let startContactForm: SuperValidated<Infer<typeof startContactSchema>>;
</script>

{#if teacher.avatarUrl}
  <!-- this div creates some height to wavy background -->
  <div class="{listing ? 'h-28' : 'h-28'} w-screen bg-secondary"></div>

  <Wavy class="-mt-8 overflow-x-hidden" />
  <div class="flex w-full max-w-md flex-col items-center gap-y-4 px-8">
    <img
      src={teacher.avatarUrl}
      alt="profile avatar"
      class="-mt-36 h-60 w-max rounded-sm object-cover"
    />
    <ProfileHeaderInfo {teacher} {listing} />
    <ContactTeacherForm
      {requestContactForm}
      {startContactForm}
      requestContactAction="?/requestContact"
      startContactAction="?/startContact"
      firstName={teacher.firstName}
    />
  </div>
{:else}
  <div
    class="flex w-screen flex-col items-center bg-secondary px-8 text-foreground"
  >
    <ProfileHeaderInfo
      {teacher}
      {listing}
      light
      maxSubjectsLength={2}
      class="mb-8"
    />
    <ContactTeacherForm
      {requestContactForm}
      {startContactForm}
      buttonVariant="third-secondary"
      requestContactAction="?/requestContact"
      startContactAction="?/startContact"
      class="max-w-md"
      firstName={teacher.firstName}
    />
  </div>

  <Wavy class="-mt-4 overflow-x-hidden " />
{/if}
