<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ConversationCard from "$lib/components/molecules/conversation-card.svelte";
  import Link from "$lib/components/atoms/link.svelte";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");

  export let data;
  $: ({ conversations, profile } = data);
</script>

<svelte:head>
  <title>Konto</title>
</svelte:head>
<!-- need to add hasaccepted as bool field to db conversations -->

<PrimaryTitle class="text-center">Dina konversationer</PrimaryTitle>
<div class="flex flex-col items-center text-center gap-y-4 my-6 w-full">
  {#each conversations as conversation}
    <a
      href={"/account/conversation/" + conversation.id}
      aria-label="Gå till konversation"
      class="w-full"
    >
      <ConversationCard {conversation} {profile} />
    </a>
  {:else}
    {#if profile.role === "teacher"}
      <p class="text-lg">Inga konversationer ännu.</p>
      <p class="text-muted-foreground">
        Se våra <Link href="/tips">tips</Link> för att förbättra dina chanser att
        bli kontaktad.
      </p>
    {:else}
      <p>Inga konversationer. Testa söka efter en lärare!</p>
    {/if}
  {/each}
</div>
