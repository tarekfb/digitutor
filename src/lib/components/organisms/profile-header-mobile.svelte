<script lang="ts">
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
  import type { SuperValidated, Infer } from "sveltekit-superforms/client";
  import ProfileHeaderInfo from "$lib/components/molecules/profile-header-info.svelte";
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

  const maxWidth = "max-w-full md:max-w-screen-sm lg:max-w-screen-md";
</script>


<div class="flex w-full {maxWidth} flex-col items-center gap-y-4 px-8">
  {#if teacher.avatarUrl}
    <img
      src={teacher.avatarUrl}
      alt="profile avatar"
      class="h-60 w-max rounded-sm object-cover"
    />
  {/if}
  <ProfileHeaderInfo {teacher} {listing} class="{teacher.avatarUrl ? '' : 'justify-evenly w-full'}" />
  <ContactTeacherForm
    {requestContactForm}
    {startContactForm}
    requestContactAction="?/requestContact"
    startContactAction="?/startContact"
    firstName={teacher.firstName}
  />
</div>
