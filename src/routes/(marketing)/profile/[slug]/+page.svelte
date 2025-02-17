<script lang="ts">
  import type { PageData } from "./$types.ts";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import { mediaQuery } from "svelte-legos";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import ProfileHeaderMobile from "src/lib/components/organisms/profile-header-mobile.svelte";
  import ContactTeacherForm from "src/lib/components/molecules/contact-teacher-form.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import Terminal from "lucide-svelte/icons/terminal";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import { languages } from "src/lib/shared/models/common.ts";
  import AlertMessage from "src/lib/components/atoms/alert-message.svelte";
  import ProfileBody from "src/lib/components/molecules/profile-body.svelte";
  import OwnerSection from "src/lib/components/molecules/owner-section.svelte";
  import { page } from "$app/stores";
  import type { Session } from "@supabase/supabase-js";
  import type { Profile } from "src/lib/shared/models/profile.ts";
  import { websiteName } from "src/lib/shared/constants/constants.ts";

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
    listingMessage,
  } = data);

  const isDesktop = mediaQuery("(min-width: 768px)");

  let isOwner = false;
  let preview = false;
  $: preview = $page.url.searchParams.get("preview") === "true";
  $: isOwner = checkIsOwner(session, teacher, preview);

  const checkIsOwner = (
    session: Session | null,
    teacher: Profile,
    preview: boolean,
  ) => {
    if (preview) return false;
    return session?.user.id === teacher.id;
  };
</script>

<svelte:head>
  <title>{websiteName} | {teacher.firstName}</title>
</svelte:head>

{#if !$isDesktop}
  <RootContainer class="m-0 w-full">
    <ProfileHeaderMobile
      {teacher}
      {listing}
      {requestContactForm}
      {startContactForm}
    />
    {#if isOwner && listingMessage}
      <div class="mx-8">
        <AlertMessage
          title={listingMessage.title}
          description={listingMessage.description}
          variant={listingMessage.variant}
          class="text-lg"
          descriptionClass="text-md"
        >
          <p class="text-md mt-2 italic">Bara du kan se detta</p>
        </AlertMessage>
      </div>
    {/if}
    <div class="flex w-full max-w-lg flex-col gap-y-4 p-8 pt-0">
      {#if listing}
        <PrimaryTitle class="text-wrap">{listing.title}</PrimaryTitle>
        <p class="text-muted-foreground">
          {#if listing.description}
            {listing.description}
          {:else}
            Den här annonsen har ingen beskrivning just nu.
          {/if}
        </p>
      {/if}

      <ProfileBody {teacher} {allowCreateReview} {reviews} {addReviewForm} />

      {#if isOwner}
        <OwnerSection {listing} />
      {/if}
    </div>
  </RootContainer>
{:else}
  <div class="flex">
    <div class="grid w-full grid-cols-3 gap-x-8 p-8">
      <aside class="flex w-full max-w-md flex-col items-center gap-y-6">
        <div
          class="w-full rounded-md bg-secondary p-8 text-background shadow-sm"
        >
          {#if teacher.avatarUrl}
            <img
              src={teacher.avatarUrl}
              alt="profile avatar"
              class="mb-8 w-full rounded-sm object-cover"
            />
          {/if}
          <div class="flex flex-col gap-y-4">
            <SecondaryTitle class="font-normal md:text-4xl"
              >{teacher.firstName}</SecondaryTitle
            >
            <Stars size={5} rating={4.7} />
            {#if listing}
              <ul>
                {#each listing?.subjects as subject, i}
                  {#if i < 6}
                    <li class="flex items-center gap-x-2">
                      <Terminal class="h-5 w-5 text-third" />
                      <p class="font-mono text-xl">
                        {languages[subject - 1].title}
                      </p>
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
          </div>
        </div>
        {#if listing}
          <p class="text-4xl">
            {listing.hourlyPrice} SEK
          </p>
        {/if}
        <ContactTeacherForm
          {requestContactForm}
          {startContactForm}
          requestContactAction="?/requestContact"
          startContactAction="?/startContact"
          firstName={teacher.firstName}
          buttonStyling="self-center"
        />
        {#if isOwner && listingMessage}
          <AlertMessage
            title={listingMessage.title}
            description={listingMessage.description}
            variant={listingMessage.variant}
            class="text-2xl"
            descriptionClass="text-lg"
          >
            <p class="mt-2 text-lg italic">Bara du kan se detta</p>
          </AlertMessage>
        {/if}
      </aside>
      <main class="col-start- col-span-2 flex max-w-4xl flex-col gap-y-6">
        {#if listing}
          <PrimaryTitle class="text-wrap">{listing.title}</PrimaryTitle>
          <p class="text-muted-foreground md:text-lg">
            {#if listing.description}
              {listing.description}
            {:else}
              Den här annonsen har ingen beskrivning just nu.
            {/if}
          </p>
        {/if}
        <ProfileBody {teacher} {allowCreateReview} {reviews} {addReviewForm} />
      </main>
    </div>
  </div>
  {#if isOwner}
    <OwnerSection {listing} />
  {/if}
{/if}
