<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ConversationCard from "$lib/components/molecules/conversation-card.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import AccountLayout from "src/lib/components/templates/account-layout.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.js";

  export let data;
  $: ({ conversations, profile } = data);
</script>

<svelte:head>
  <title>{websiteName} | Konto</title>
</svelte:head>

<AccountLayout>
  <PrimaryTitle class="text-center">Dina konversationer</PrimaryTitle>
  <RootContainer class="my-6 w-full text-center">
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
        <p>
          Inga konversationer. Testa <Link href="/search"
            >söka efter en lärare</Link
          >!
        </p>
      {/if}
    {/each}
  </RootContainer>
</AccountLayout>
