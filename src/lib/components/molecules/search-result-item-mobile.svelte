<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Contact, Terminal } from "lucide-svelte";
  import Avatar from "../atoms/avatar.svelte";
  import type { SearchResult } from "src/lib/shared/models/search";
  import { Subjects } from "src/lib/shared/models/common";
  import { ChevronRight } from "lucide-svelte";
  // import { mediaQuery } from "svelte-legos";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import Stars from "../atoms/stars.svelte";
  import ContactTeacherForm from "./contact-teacher-form.svelte";
  import type {
    requestContactSchema,
    startContactSchema,
  } from "src/lib/shared/models/conversation";
  import type { Infer } from "sveltekit-superforms";
  import type { SuperValidated } from "sveltekit-superforms/client";
  import Button from "../ui/button/button.svelte";
  import SubjectItem from "../atoms/subject-item.svelte";
  import Link from "../atoms/link.svelte";

  // const isDesktop = mediaQuery("(min-width: 768px)");
  const rating = 4.7;
  const nbrOfReviews = 11;
  export let result: SearchResult;
  export let requestContactForm: SuperValidated<
    Infer<typeof requestContactSchema>
  >;
  export let startContactForm: SuperValidated<Infer<typeof startContactSchema>>;
  export let searchTerm = 10;
  const subject =
    result.subjects.find((s) => s === searchTerm) ?? result.subjects.at(0);
</script>

<div class="flex flex-col gap-y-4 gap-x-4">
  {#if !result.avatar}
    <div class="flex gap-x-4">
      <a
        href="/profile/{result.profile.id}?id={result.id}"
        aria-label="Gå till profil"
      >
        <img
          src={result.avatar}
          alt="profile avatar"
          class="object-cover h-36 w-36 rounded-md"
        />
      </a>
      <div class="flex flex-col items-start gap-y-2 flex-grow">
        <PrimaryTitle>
          {result.profile.firstName}
        </PrimaryTitle>
        <div class="flex flex-col gap-y-1">
          <Stars {rating} size={4} class="p-0 m-0 " />
          <p class="text-muted-foreground">
            {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
          </p>
        </div>
        <Button
          class="self-center place-self-end mt-auto"
          href="/profile/{result.profile.id}?id={result.id}"
          >Kontakta läraren</Button
        >
      </div>
    </div>
  {:else}
    <div class="flex justify-between gap-x-2">
      <div class="flex flex-col gap-y-2 items-start">
        <Link
          class="text-foreground"
          href="/profile/{result.profile.id}?id={result.id}"
        >
          <PrimaryTitle>
            {result.profile.firstName}
          </PrimaryTitle>
        </Link>
        <div class="flex flex-col gap-y-1">
          <Stars {rating} size={4} class="p-0 m-0 " />
          <p class="text-muted-foreground">
            {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
          </p>
        </div>
      </div>
      <Button
        class="self-center"
        href="/profile/{result.profile.id}?id={result.id}"
        >Kontakta läraren</Button
      >
    </div>
  {/if}
  <div class="flex justify-evenly">
    <div class="flex flex-col gap-y-2 items-center col-start-5 col-span-4">
      <h3 class="text-2xl p-0 m-0 h-8">220 SEK</h3>
      <p class="text-muted-foreground">60 minuter</p>
    </div>
    <div class="flex flex-col gap-y-2 items-center col-start-9 col-span-4">
      <SubjectItem
        {subject}
        class="p-0 m-0 h-8 gap-x-1 overflow-x-hidden self-start"
      />
      <Button
        variant="ghost"
        class="underline decoration-accent font-normal tracking-normal text-md lowercase m-0 p-2  max-h-6 "
        >...se {result.subjects.length - 1} till</Button
      >
    </div>
  </div>

  <PrimaryTitle class="text-wrap">{result.title}</PrimaryTitle>
  <p class="text-muted-foreground">
    {#if result.description}
      {result.description}
    {:else}
      Den här annonsen har ingen beskrivning just nu.
    {/if}
  </p>
  <!-- todo if not avatar -->
</div>
