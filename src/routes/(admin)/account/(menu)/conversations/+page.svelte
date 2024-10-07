<script lang="ts">
  import type { PageData } from "./$types";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import ConversationCard from "$lib/components/molecules/conversation-card.svelte";
  import Link from "$lib/components/atoms/link.svelte";

  export let data: PageData;
  $: ({ conversations, profile } = data);
</script>

<PrimaryTitle class="text-center">Dina konversationer</PrimaryTitle>
<div class="flex flex-col items-center text-center gap-y-4 my-6">
  {#each conversations as conversation}
    <a
      href={"/account/conversation/" + conversation.id}
      aria-label="Gå till konversation"
      class="w-full"
    >
      <ConversationCard {conversation} {profile} />
    </a>
  {:else}
    <p class="text-lg">Inga konversationer ännu.</p>
    <p class="text-muted-foreground">
      Se våra <Link href="/tips">tips</Link> för att förbättra dina chanser att bli
      kontaktad.
    </p>
  {/each}
</div>
