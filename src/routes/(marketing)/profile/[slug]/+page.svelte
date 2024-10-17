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
  import { Subjects } from "src/lib/shared/models/common";
  import AlertMessage from "src/lib/components/atoms/alert-message.svelte";
  import ProfileBody from "src/lib/components/molecules/profile-body.svelte";

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
</script>

{#if !$isDesktop}
  <RootContainer class="w-full m-0 ">
    <ProfileHeaderMobile
      {teacher}
      {listing}
      {requestContactForm}
      {startContactForm}
    />
    {#if session?.user.id === teacher.id && listingMessage}
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
    <div class="flex flex-col gap-y-4 p-8 w-full max-w-lg">
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

      {#if session?.user.id === teacher.id}
        <small
          class="mt-6 flex flex-col gap-y-2 text-center text-muted-foreground px-8 text-lg"
        >
          <p>
            Vill du göra ändringar på informationen om dig? <a
              href="/account"
              class="underline">Gå till din profil.</a
            >
          </p>
          {#if listing}
            <p>
              Vill du göra ändringar på din annons? <a
                href="/listing/{listing.id}"
                class="underline">Gå till annonsen.</a
              >
            </p>
          {/if}
          <p class="italic">Bara du kan se detta.</p>
        </small>
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
          <div class="flex flex-col gap-y-4 {!listing ? ' items-center' : ''}">
            <SecondaryTitle class="font-normal md:text-4xl  "
              >{teacher.first_name}</SecondaryTitle
            >
            <Stars size={5} rating={4.7} />
            {#if listing}
              <ul>
                {#each listing?.subjects as subject, i}
                  {#if i < 6}
                    <li class="flex gap-x-2 items-center">
                      <Terminal class="w-5 h-5 text-primary" />
                      <p class="font-mono text-2xl">{Subjects[subject]}</p>
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
        />
        {#if session?.user.id === teacher.id && listingMessage}
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
      <main class="col-start-2 col-span-2 flex flex-col gap-y-6">
        {#if listing}
          <PrimaryTitle class="text-wrap">{listing.title}</PrimaryTitle>
          <p class="text-xl text-muted-foreground">
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
  {#if session?.user.id === teacher.id}
    <small
      class="mt-6 flex flex-col gap-y-2 text-center text-muted-foreground px-8 mb-8 text-lg"
    >
      <p>
        Vill du göra ändringar på informationen om dig? <a
          href="/account"
          class="underline">Gå till din profil.</a
        >
      </p>
      {#if listing}
        <p>
          Vill du göra ändringar på din annons? <a
            href="/listing/{listing.id}"
            class="underline">Gå till annonsen.</a
          >
        </p>
      {/if}
      <p class="italic">Bara du kan se detta.</p>
    </small>
  {/if}
{/if}
