<script lang="ts">
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import ContactTeacherForm from "src/lib/components/molecules/contact-teacher-form.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { contactSchema } from "src/lib/models/conversations.js";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data;
  const { profile, listings, session } = data;

  const contactForm = superForm(data.contactForm, {
    validators: zodClient(contactSchema),
  });

  const reviews: string[] = [];
</script>

<div class="flex flex-col gap-y-4">
  <div class="flex justify-between gap-x-2 text-2xl">
    <PrimaryTitle>{profile.first_name}</PrimaryTitle>
    <Avatar
      {profile}
      onClick={undefined}
    />
  </div>

  <SecondaryTitle>Annonser</SecondaryTitle>
  <div class="flex flex-col gap-y-4 my-6">
    {#each listings as listing}
      <a href="/listing/{listing.id}" aria-label="Navigate to ad">
        <ListingCard {listing} />
      </a>
    {:else}
      <p>{profile.first_name} har inga annonser ännu.</p>
    {/each}
  </div>

  <SecondaryTitle>Recensioner</SecondaryTitle>
  {#each reviews as review}
    <p>{review}</p>
  {:else}
    <p>{profile.first_name} har inga recensioner ännu.</p>
  {/each}

  <ContactTeacherForm
    form={contactForm}
    action="?/contact"
    firstName={profile.first_name}
    class="mx-0"
    buttonStyling="self-end"
  />

  {#if session?.user.id === profile.id}
    <small class="text-center text-muted-foreground">
      Vill du göra ändringar? <a href="/account" class="underline"
        >Gå till din profil.</a
      >
    </small>
  {/if}
</div>
