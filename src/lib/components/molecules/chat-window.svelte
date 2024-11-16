<script lang="ts">
  import { timeAgo } from "src/lib/shared/utils/utils";
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";
  import type { Message } from "src/lib/shared/models/conversation";
  import type { WritableLoadable } from "@square/svelte-store";
  import PrimaryTitle from "../atoms/primary-title.svelte";

  export let chatStore: WritableLoadable<Message[]>;
  export let self: Tables<"profiles">;
  export let other: Tables<"profiles">;

  const scroll = (element: HTMLElement, messages: Message[]) => {
    // messages is not needed, just to provide reactivity dependancy
    setTimeout(
      () => element.scrollIntoView({ behavior: "smooth", block: "end" }),
      250,
    );
    return {
      update() {
        setTimeout(
          () => element.scrollIntoView({ behavior: "smooth", block: "end" }),
          250,
        );
      },
    };
  };
</script>

<div class="flex flex-col gap-y-4 overflow-y-auto">
  <div class="flex flex-col items-center gap-y-2 mb-4">
    <Avatar
      url={other.avatar_url ?? ""}
      href="/profile/{other.id}"
      firstName={other.first_name}
      lastName={other.last_name}
      role={other.role}
      class="h-20 w-20 {other.avatar_url && 'md:h-28 md:w-28 lg:h-36 lg:w-36'}"
      fallbackClass="h-20 w-20 text-3xl"
    />
    <PrimaryTitle>{other.first_name}</PrimaryTitle>
  </div>
  <ul class="flex flex-col gap-y-4 justify-end">
    {#await chatStore.load()}
      Loading...
    {:then}
      {#each $chatStore as message}
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
                href="/profile/{other.id}"
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
    <!-- this div acts as a scroll helper to newest message is visible -->
    <div class="h-36" use:scroll={$chatStore}></div>
  </ul>
</div>
