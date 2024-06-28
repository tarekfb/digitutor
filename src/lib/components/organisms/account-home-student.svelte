<script lang="ts">
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import ConversationCard from "../molecules/conversation-card.svelte";

  export let conversations;
  export let profile;
</script>

<PrimaryTitle>Dina konversationer</PrimaryTitle>
<div class="flex flex-col items-center gap-y-4 my-6">
  {#if conversations.length === 0}
    <p>Inga konversationer. Testa söka efter en lärare!</p>
  {:else}
    {#each conversations as conversation}
      <a
        href={"/account/conversation/" + conversation.id}
        aria-label="Gå till konversation"
        class="w-full"
      >
        <ConversationCard {conversation} {profile} />
      </a>
    {/each}
  {/if}
</div>
