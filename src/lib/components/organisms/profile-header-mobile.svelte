<script lang="ts">
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "$lib/components/molecules/contact-teacher-form.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import { Subjects } from "src/lib/shared/models/common";
  import { Terminal } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import type { Tables } from "src/supabase";
  import type { Listing } from "src/lib/shared/models/listing";
  import type { SuperValidated } from "sveltekit-superforms/client";
  import ProfileHeaderInfo from "../molecules/profile-header-info.svelte";

  export let teacher: Tables<"profiles">;
  export let listing: Listing | undefined;
  export let requestContactForm: SuperValidated<
    {
      role: string;
      teacher: string;
    },
    any,
    any
  >;
  export let startContactForm: SuperValidated<
    {
      role: string;
      teacher: string;
      firstMessage: string;
    },
    any,
    any
  >;
</script>

{#if teacher.avatar_url}
  <!-- this div creates some height to wavy background -->
  <div class="{listing ? 'h-28' : 'h-10'} w-screen bg-accent"></div>

  <svg class="fill-current text-accent -mx-8 -mt-8" viewBox="0 0 900 100"
    ><path
      d="M0 51L10 51.5C20 52 40 53 60 58.2C80 63.3 100 72.7 120 72.7C140 72.7 160 63.3 180 57C200 50.7 220 47.3 240 49.8C260 52.3 280 60.7 300 62.2C320 63.7 340 58.3 360 58.3C380 58.3 400 63.7 420 61.5C440 59.3 460 49.7 480 50.7C500 51.7 520 63.3 540 68.5C560 73.7 580 72.3 600 73.5C620 74.7 640 78.3 660 77.3C680 76.3 700 70.7 720 65.5C740 60.3 760 55.7 780 58.2C800 60.7 820 70.3 840 73.8C860 77.3 880 74.7 890 73.3L900 72L900 0L890 0C880 0 860 0 840 0C820 0 800 0 780 0C760 0 740 0 720 0C700 0 680 0 660 0C640 0 620 0 600 0C580 0 560 0 540 0C520 0 500 0 480 0C460 0 440 0 420 0C400 0 380 0 360 0C340 0 320 0 300 0C280 0 260 0 240 0C220 0 200 0 180 0C160 0 140 0 120 0C100 0 80 0 60 0C40 0 20 0 10 0L0 0Z"
    /></svg
  >
  <div class="flex flex-col gap-y-4 items-center w-full">
    <img
      src={teacher.avatar_url}
      alt="profile avatar"
      class="object-cover w-max h-60 -mt-28"
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
  <div
    class="w-screen bg-accent flex flex-col gap-y-4 items-center text-foreground"
  >
    <ProfileHeaderInfo {teacher} {listing} light maxSubjectsLength={2} />
    <ContactTeacherForm
      {requestContactForm}
      {startContactForm}
      requestContactAction="?/requestContact"
      startContactAction="?/startContact"
      firstName={teacher.first_name}
      buttonStyling="self-end"
    />
  </div>

  <svg
    class="fill-current text-accent -mx-8 -mt-4 overflow-x-hidden"
    viewBox="0 0 900 100"
    ><path
      d="M0 51L10 51.5C20 52 40 53 60 58.2C80 63.3 100 72.7 120 72.7C140 72.7 160 63.3 180 57C200 50.7 220 47.3 240 49.8C260 52.3 280 60.7 300 62.2C320 63.7 340 58.3 360 58.3C380 58.3 400 63.7 420 61.5C440 59.3 460 49.7 480 50.7C500 51.7 520 63.3 540 68.5C560 73.7 580 72.3 600 73.5C620 74.7 640 78.3 660 77.3C680 76.3 700 70.7 720 65.5C740 60.3 760 55.7 780 58.2C800 60.7 820 70.3 840 73.8C860 77.3 880 74.7 890 73.3L900 72L900 0L890 0C880 0 860 0 840 0C820 0 800 0 780 0C760 0 740 0 720 0C700 0 680 0 660 0C640 0 620 0 600 0C580 0 560 0 540 0C520 0 500 0 480 0C460 0 440 0 420 0C400 0 380 0 360 0C340 0 320 0 300 0C280 0 260 0 240 0C220 0 200 0 180 0C160 0 140 0 120 0C100 0 80 0 60 0C40 0 20 0 10 0L0 0Z"
    /></svg
  >
{/if}
