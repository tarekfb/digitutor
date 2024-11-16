<script lang="ts">
  import { timeAgo } from "src/lib/shared/utils/utils";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";
  import type { Message } from "src/lib/shared/models/conversation";
  import type { WritableLoadable } from "@square/svelte-store";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import AvatarNameBar from "../organisms/avatar-name-bar.svelte";

  export let chatStore: WritableLoadable<Message[]>;
  export let self: Tables<"profiles">;
  export let other: Tables<"profiles">;

  let bottomOffset = 150; // The height of the fixed form element.

  const scrollFunc = (element: HTMLElement) => {
    element.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const scroll = (element: HTMLElement, messages: Message[]) => {
    //  node?.scrollIntoView({ behavior: "smooth", block: "end" });
    // node.scrollTop = node.scrollHeight;
    scrollFunc(element);
    return {
      update() {
        scrollFunc(element);
      },
    };
  };
</script>

<div class="flex flex-col gap-y-4 overflow-y-auto">
  <div class="flex flex-col items-center gap-y-2 mb-4">
    <AvatarNameBar profile={other} class="self-center">
      <PrimaryTitle>{other.first_name}</PrimaryTitle>
    </AvatarNameBar>
  </div>
  <!-- use:scroll={$chatStore} -->
  <ul class="flex flex-col gap-y-4 justify-end">
    {#await chatStore.load()}
      Loading...
    {:then}
      {#each $chatStore as message, index}
        {#if message.sender === self.id}
          <li class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-end">
            <p>{message.content}</p>
            {timeAgo(message.createdAt)} sedan
            <p class="text-xs text-muted-foreground"></p>
          </li>
        {:else}
          <li class="flex gap-x-4">
            <div class="flex flex-col justify-end">
              <Avatar
                onClick={undefined}
                url={other.avatar_url}
                firstName={other.first_name}
                lastName={other.last_name}
                role={other.role}
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
          </li>
        {/if}
      {:else}
        <p>Inga meddelanden ännu.</p>
      {/each}
    {:catch error}
      {`Error :(`}
    {/await}
    <div class="h-36" use:scroll={$chatStore}></div>
  </ul>
</div>
