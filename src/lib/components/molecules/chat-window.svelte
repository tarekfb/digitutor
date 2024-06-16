<script lang="ts">
  import { timeAgo } from "src/lib/utils";
  import { chat, loadChat } from "src/stores/chat";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";

  export let messages;
  export let supabase;
  export let conversationId;
  export let profile;
  export let receiver;

  try {
    loadChat(conversationId, supabase, undefined, messages);
  } catch (e) {
    console.error("error", e);
  }

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
      {#if message.sender === profile.id}
        <!-- self -->
        <div class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-end">
          <p>{message.content}</p>
          <p class="text-xs text-muted-foreground">
            {timeAgo(message.created_at)} sedan
          </p>
        </div>
      {:else}
        <div class="flex gap-x-4">
          <div class="flex flex-col justify-end">
            <Avatar
              onClick={undefined}
              profile={receiver}
              class="text-sm w-7 h-7"
            />
          </div>
          <div class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-start">
            <p>{message.content}</p>
            <p class="text-xs text-muted-foreground">
              {timeAgo(message.created_at)} sedan
            </p>
          </div>
        </div>
      {/if}
    {:else}
      <p>Inga meddelanden ännu.</p>
    {/each}
  </div>
</ScrollArea>
