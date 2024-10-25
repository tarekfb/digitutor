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

  // const isDesktop = mediaQuery("(min-width: 768px)");
  const rating = 4.7;
  const nbrOfReviews = 11;
  export let result: SearchResult;
  export let requestContactForm: SuperValidated<
    Infer<typeof requestContactSchema>
  >;
  export let startContactForm: SuperValidated<Infer<typeof startContactSchema>>;
</script>

<li class="p-4">
  <div class="flex gap-x-4">
    {#if result.avatar}
      <a
        href="/profile/{result.profile.id}?id={result.id}"
        aria-label="Gå till profil"
      >
        <img
          src={result.avatar}
          alt="profile avatar"
          class="object-cover w-32 h-32 rounded-md mb-8"
        />
      </a>
      <div class="flex flex-col gap-y-2">
        <PrimaryTitle>
          {result.profile.firstName}
        </PrimaryTitle>
        <Button href="/profile/{result.profile.id}?id={result.id}"
          >Kontakta läraren</Button
        >
        <div class="flex flex-col gap-y-2 items-center">
          <Stars rating={4.7} size={5} />
          <p class="text-muted-foreground">
            {nbrOfReviews} recension{nbrOfReviews > 1 ? "er" : ""}
          </p>
        </div>
      </div>
      <!-- content here -->
    {/if}
  </div>
</li>
