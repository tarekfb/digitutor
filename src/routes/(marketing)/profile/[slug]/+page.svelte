<script lang="ts">
  import type { PageData } from "./$types";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import { mediaQuery } from "svelte-legos";
  import RootContainer from "src/lib/components/molecules/root-container.svelte";
  import ProfileHeaderMobile from "src/lib/components/organisms/profile-header-mobile.svelte";
  import ContactTeacherForm from "src/lib/components/molecules/contact-teacher-form.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import { Terminal } from "lucide-svelte";
  import Stars from "src/lib/components/atoms/stars.svelte";
  import { languages } from "src/lib/shared/models/common";
  import AlertMessage from "src/lib/components/atoms/alert-message.svelte";
  import ProfileBody from "src/lib/components/molecules/profile-body.svelte";
  import OwnerSection from "src/lib/components/molecules/owner-section.svelte";
  import { page } from "$app/stores";
  import type { Tables } from "src/supabase";
  import type { Session } from "@supabase/supabase-js";

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
    teacher: Tables<"profiles">,
    preview: boolean,
  ) => {
    if (preview) return false;
    return session?.user.id === teacher.id;
  };
</script>

{#if !$isDesktop}
  <RootContainer class="w-full m-0 ">
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
          <p class="italic text-md mt-2">Bara du kan se detta</p>
        </AlertMessage>
      </div>
    {/if}
    <div class="flex flex-col gap-y-4 p-8 pt-0 w-full max-w-lg">
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
    <div class="grid grid-cols-3 w-full gap-x-8 p-8">
      <aside class="flex flex-col items-center gap-y-6 w-full max-w-md">
        <div class="p-8 rounded-md shadow-sm bg-accent w-full text-background">
          {#if teacher.avatar_url}
            <img
              src={teacher.avatar_url}
              alt="profile avatar"
              class="object-cover w-full rounded-sm mb-8"
            />
          {/if}
          <div class="flex flex-col gap-y-4">
            <SecondaryTitle class="font-normal md:text-4xl whitespace-normal"
              >{teacher.first_name}</SecondaryTitle
            >
            <Stars size={5} rating={4.7} />
            {#if listing}
              <ul>
                {#each listing?.subjects as subject, i}
                  {#if i < 6}
                    <li class="flex gap-x-2 items-center">
                      <Terminal class="w-5 h-5 text-primary" />
                      <p class="font-mono text-2xl">
                        {languages[subject].label}
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
            {listing.hourly_price} SEK
          </p>
        {/if}
        <ContactTeacherForm
          {requestContactForm}
          {startContactForm}
          requestContactAction="?/requestContact"
          startContactAction="?/startContact"
          firstName={teacher.first_name}
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
            <p class="italic text-lg mt-2">Bara du kan se detta</p>
          </AlertMessage>
        {/if}
      </aside>
      <main class="col-start- col-span-2 flex flex-col gap-y-6 max-w-4xl">
        {#if listing}
          <PrimaryTitle class="text-wrap">{listing.title}</PrimaryTitle>
          <p class="md:text-lg text-muted-foreground">
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
