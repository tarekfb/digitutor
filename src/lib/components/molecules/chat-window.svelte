<script lang="ts">
  import { timeAgo } from "src/lib/utils";
  import { chat, loadChat } from "src/stores/chat";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { Tables } from "src/supabase";

  export let messages;
  export let supabase;
  export let conversationId;
  export let profile;
  export let receiver;

  loadChat(conversationId, supabase, undefined, messages);

  const scroll = (node: HTMLElement, messages: Tables<"messages">[]) => {
    setTimeout(() => {
      node?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 750);
    // the node contains all messages
    // scroll still doesn't work without this settimeout hack
    // todo: fix

    return {
      update() {
        node?.scrollIntoView({ behavior: "smooth", block: "end" });
      },
    };
  };
</script>

<ScrollArea class="max-h-[50vh]">
  <div class="flex flex-col gap-y-4" use:scroll={$chat}>
    {#each $chat as message}
      <div
        class="flex flex-col gap-y-2 bg-card p-2 rounded-md {message.sender ===
        profile.id
          ? 'self-end'
          : 'self-start'}"
      >
        <h3 class="font-semibold">
          {message.sender === profile.id ? "Du" : receiver.first_name}
        </h3>
        <p>{message.content}</p>
        <p class="text-xs text-muted-foreground">
          {timeAgo(message.created_at)} sedan
        </p>
      </div>
    {:else}
      <p>Inga meddelanden ännu</p>
    {/each}
  </div>
</ScrollArea>
