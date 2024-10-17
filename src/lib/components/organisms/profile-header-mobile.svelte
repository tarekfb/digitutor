<script lang="ts">
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import type { Tables } from "src/supabase";
  import type { Listing } from "src/lib/shared/models/listing";
  import type { SuperValidated, Infer } from "sveltekit-superforms/client";
  import ProfileHeaderInfo from "$lib/components/molecules/profile-header-info.svelte";
  import Wavy from "$lib/components/atoms/wavy.svelte";
  import {
    requestContactSchema,
    startContactSchema,
  } from "src/lib/shared/models/conversation";

  export let teacher: Tables<"profiles">;
  export let listing: Listing | undefined;
  export let requestContactForm: SuperValidated<
    Infer<typeof requestContactSchema>
  >;
  export let startContactForm: SuperValidated<Infer<typeof startContactSchema>>;
</script>

{#if teacher.avatar_url}
  <!-- this div creates some height to wavy background -->
  <div class="{listing ? 'h-28' : 'h-28'} w-screen bg-accent"></div>

  <Wavy class="-mt-8 overflow-x-hidden" />
  <div class="flex flex-col gap-y-4 items-center w-full max-w-md">
    <img
      src={teacher.avatar_url}
      alt="profile avatar"
      class="object-cover w-max h-60 -mt-36 rounded-sm"
    />
    <ProfileHeaderInfo {teacher} {listing} />
    <ContactTeacherForm
      {requestContactForm}
      {startContactForm}
      requestContactAction="?/requestContact"
      startContactAction="?/startContact"
      firstName={teacher.first_name}
      buttonStyling="self-end"
    />
  </div>
{:else}
  <div class="w-screen bg-accent flex flex-col items-center text-foreground">
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
      requestContactAction="?/requestContact"
      startContactAction="?/startContact"
      firstName={teacher.first_name}
      buttonStyling="self-end"
    />
  </div>

  <Wavy class="-mt-4 overflow-x-hidden " />
{/if}
