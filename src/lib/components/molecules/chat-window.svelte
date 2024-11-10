<script lang="ts">
  import { timeAgo } from "src/lib/shared/utils/utils";
  // import { chat, loadChat } from "src/stores/chat";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";
  import type { Message } from "src/lib/shared/models/conversation";
  import { message } from "sveltekit-superforms";
  import type { WritableLoadable } from "@square/svelte-store";

  export let chatStore: WritableLoadable<Message[]>;
  // export let supabase;
  // export let conversationId;
  export let profile: Tables<"profiles">;
  export let receiver: Tables<"profiles">;

  const scroll = (node: HTMLElement, messages: Message[]) => {
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

  $: console.log($chatStore);
</script>

<ScrollArea class="max-h-[50vh]">
  <div class="flex flex-col gap-y-4" use:scroll={$chatStore}>
    {#await chatStore.load()}
      Loading...
    {:then messages}
      {#each messages as message}
        {#if message.sender === profile.id}
          <div class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-end">
            <p>{message.content}</p>
            <p class="text-xs text-muted-foreground">
              {timeAgo(message.createdAt)} sedan
            </p>
          </div>
        {:else}
          <div class="flex gap-x-4">
            <div class="flex flex-col justify-end">
              <Avatar
                onClick={undefined}
                url={receiver.avatar_url}
                firstName={receiver.first_name}
                lastName={receiver.last_name}
                role={receiver.role}
                class="text-sm w-7 h-7"
              />
            </div>
            <div
              class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-start"
            >
              <p>{message.content}</p>
              <p class="text-xs text-muted-foreground">
                {timeAgo(message.createdAt)} sedan
              </p>
            </div>
          </div>
        {/if}
      {:else}
        <p>Inga meddelanden ännu.</p>
      {/each}
    {:catch error}
      {`Error :(`}
    {/await}
  </div>

  <!-- {#await chatStore.load()}
    <div class="flex flex-col gap-y-4" use:scroll={$chatStore}>
      {#each $chatStore as message}
        {#if message.sender === profile.id}
          <div class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-end">
            <p>{message.content}</p>
            <p class="text-xs text-muted-foreground">
              {timeAgo(message.createdAt)} sedan
            </p>
          </div>
        {:else}
          <div class="flex gap-x-4">
            <div class="flex flex-col justify-end">
              <Avatar
                onClick={undefined}
                url={receiver.avatar_url}
                firstName={receiver.first_name}
                lastName={receiver.last_name}
                role={receiver.role}
                class="text-sm w-7 h-7"
              />
            </div>
            <div
              class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-start"
            >
              <p>{message.content}</p>
              <p class="text-xs text-muted-foreground">
                {timeAgo(message.createdAt)} sedan
              </p>
            </div>
          </div>
        {/if}
      {:else}
        <p>Inga meddelanden ännu.</p>
      {/each}
    </div>
  {/await} -->
</ScrollArea>
