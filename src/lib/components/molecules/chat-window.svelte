<script lang="ts">
  import { timeAgo } from "src/lib/shared/utils/utils";
  import Avatar from "../atoms/avatar.svelte";
  import type { Message } from "src/lib/shared/models/conversation";
  import type { WritableLoadable } from "@square/svelte-store";
  import PrimaryTitle from "../atoms/primary-title.svelte";
  import AlertMessage from "../atoms/alert-message.svelte";
  import { secondaryAltButtonVariant } from "src/lib/shared/constants/constants";
  import { Button } from "../ui/button";
  import { goto } from "$app/navigation";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import { defaultErrorDescription } from "$lib/shared/constants/constants";
  import type { Profile } from "src/lib/shared/models/profile";

  export let chatStore: WritableLoadable<Message[]>;
  export let self: Profile;
  export let other: Profile;

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
      url={other.avatarUrl ?? ""}
      href="/profile/{other.id}"
      firstName={other.firstName}
      lastName={other.lastName}
      role={other.role}
      class="h-20 w-20 {other.avatarUrl && 'md:h-28 md:w-28 lg:h-36 lg:w-36'}"
      fallbackClass="h-20 w-20 text-3xl"
    />
    <PrimaryTitle>{other.firstName}</PrimaryTitle>
    <Button
      on:click={() => goto(`/profile/${other.id}`)}
      variant="secondary"
      class={secondaryAltButtonVariant()}>Se profil</Button
    >
  </div>
  <ul class="flex flex-col gap-y-4 justify-end">
    {#await chatStore.load()}
      <li class="flex items-center gap-x-4 justify-start">
        <Skeleton class="h-12 w-12 rounded-full bg-card" />
        <div class="flex flex-col gap-y-2">
          <Skeleton class="h-4 w-64 text-primary bg-card" />
          <Skeleton class="h-4 w-52 bg-card" />
        </div>
      </li>
      <li class="flex flex-col items-end gap-y-2 justify-end">
        <Skeleton class="h-4 w-64 text-primary bg-card " />
        <Skeleton class="h-4 w-44 bg-card" />
      </li>
    {:then}
      {#each $chatStore as message}
        {#if message.sender === self.id}
          <li class="flex flex-col gap-y-2 bg-card p-2 rounded-md self-end">
            <p>{message.content}</p>
            <p class="text-xs text-muted-foreground">
              {timeAgo(message.createdAt)} sedan
            </p>
          </li>
        {:else}
          <li class="flex gap-x-4">
            <div class="flex flex-col justify-end">
              <Avatar
                href="/profile/{other.id}"
                url={other.avatarUrl}
                firstName={other.firstName}
                lastName={other.lastName}
                role={other.role}
                size="8"
                class="text-sm"
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
        <p class="self-center">Inga meddelanden ännu.</p>
      {/each}
    {:catch error}
      <AlertMessage
        title="Vi kunde inte hämta några meddelanden"
        description={defaultErrorDescription}
        variant="destructive"
        descriptionClass="text-md"
      />
      <!-- todo: provide contact option here -->
    {/await}
    <!-- this div acts as a scroll helper to ensure newest message is visible -->
    <div class="h-32" use:scroll={$chatStore}></div>
  </ul>
</div>
