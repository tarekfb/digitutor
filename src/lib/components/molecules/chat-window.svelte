<script lang="ts">
  import { timeAgo } from "src/lib/shared/utils/utils";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";
  import type { Message } from "src/lib/shared/models/conversation";
  import type { WritableLoadable } from "@square/svelte-store";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import AvatarNameBar from "../organisms/avatar-name-bar.svelte";

  // export let supabase;
  // export let conversationId;
  export let chatStore: WritableLoadable<Message[]>;
  export let self: Tables<"profiles">;
  export let other: Tables<"profiles">;

  const scroll = (node: HTMLElement, index: number) => {
    // setTimeout(() => {
    //   node?.scrollIntoView({ behavior: "smooth", block: "end" });
    // }, 750);
    // the node contains all messages
    // scroll still doesn't work without this settimeout hack
    // todo: fix
    console.log("index", index);
    console.log("last inedex", $chatStore.length - 1);
    if (index === $chatStore.length - 1) {
      console.log("scrolling");
      node?.scrollIntoView({ behavior: "smooth", block: "end" });
      console.log(node.innerHTML);
    }
    return {
      update() {
        console.log("ran uopdate");
        if (index === $chatStore.length - 1) {
          console.log("scrolling");
          node?.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      },
    };
  };

  // $: listElement?.scrol({top: listElement.scrollHeight, behavior: "smooth"}), $chatStore;
</script>

<ScrollArea class="flex flex-col gap-y-4 max-h-screen">
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
          <li
            class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-end"
            use:scroll={index}
          >
            <p>{message.content}</p>
            {timeAgo(message.createdAt)} sedan
            <p class="text-xs text-muted-foreground"></p>
          </li>
        {:else}
          <li class="flex gap-x-4" use:scroll={index}>
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
  </ul>
</ScrollArea>
