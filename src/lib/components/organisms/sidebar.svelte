<script lang="ts">
  import { convertToInitials } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { goto } from "$app/navigation";
  import {
    Settings,
    LogOutIcon,
    Home,
    MessageCircle,
    X,
    Menu,
  } from "lucide-svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import type { Role } from "$lib/shared/models/profile";
  import { websiteName } from "$lib/shared/constants/constants";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import type { Conversation } from "src/lib/shared/models/conversation";
  import Link from "../atoms/link.svelte";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { mediaQuery } from "svelte-legos";
  import SidebarNav from "./sidebar-nav.svelte";

  export let role: Role | undefined;
  export let conversations: Conversation[];
  export let logout: () => void;

  const isDesktop = mediaQuery("(min-width: 768px)");

  let isMinimized = true;
  let logoutLoading = false;

  const wrappedLogout = () => {
    logoutLoading = true;
    logout();
    logoutLoading = false;
  };

  const title =
    "text-lg font-semibold tracking-tight overflow-x-hidden text-ellipsis whitespace-nowrap";
</script>

<Sidebar.Root direction="right" bind:open={isMinimized}>
  <Sidebar.Trigger class="absolute right-5 top-5 hover:text-accent active:text-accent " aria-label="Öppna meny">
    <Menu class="h-5 w-5" />
  </Sidebar.Trigger>
  <Sidebar.Content
    class="rounded-none w-4/5 {$isDesktop ? 'w-1/5' : 'swipable'} px-2"
  >
    <Sidebar.Header class="relative flex items-center justify-center py-1">
      <Sidebar.Close
        class="absolute -left-10 m-0 p-0 hover:text-accent active:text-accent"
        aria-label="Stäng meny"><X /></Sidebar.Close
      >
      <Link href="/">
        <Sidebar.Title class="text-3xl">{websiteName}</Sidebar.Title>
      </Link>
    </Sidebar.Header>
    <div class="flex flex-col items-start gap-y-4">
      <Separator />
      <h2 class={title}>Dashboard</h2>
      <SidebarNav href="/account">
        {#if role === "teacher"}
          <Home class="h-5 w-5" />
          Annonser
        {:else}
          <MessageCircle class="h-5 w-5" />
          Konversationer
        {/if}
      </SidebarNav>
      <SidebarNav href="/account/settings">
        <Settings class="h-5 w-5" />
        Inställningar
      </SidebarNav>
      {#if role === "teacher"}
        <Separator />
        <h2 class="relative {title}">Konversationer</h2>
        <ScrollArea class="max-h-96">
          <div class="space-y-1">
            {#each conversations as conversation}
              <Button
                variant="ghost"
                class="w-full justify-start font-normal"
                on:click={() =>
                  goto(`/account/conversation/${conversation.id}`)}
              >
                <Avatar.Root
                  class="h-6 w-6 flex justify-center items-center mr-2"
                >
                  <Avatar.Fallback class="bg-accent text-background text-xs">
                    {convertToInitials(
                      conversation.student.first_name,
                      conversation.student.last_name,
                    )}
                  </Avatar.Fallback>
                </Avatar.Root>
                {role === "teacher"
                  ? conversation.student.first_name
                  : conversation.teacher.first_name}
              </Button>
            {:else}
              <p class="text-md">Inga konversationer ännu.</p>
            {/each}
          </div>
        </ScrollArea>
      {/if}
      <Separator />
      <div class="w-full flex justify-center">
        <Button
          variant="ghost"
          class="gap-x-1"
          disabled={logoutLoading}
          on:click={wrappedLogout}
        >
          {#if logoutLoading}
            <LoadingSpinner class="text-background" />
          {:else}
            <LogOutIcon size="18" />
            Logga ut
          {/if}
        </Button>
      </div>
    </div>
  </Sidebar.Content>
  <!-- <Sidebar.Footer>
      <Button>Submit</Button>
      <Sidebar.Close>Cancel</Sidebar.Close>
    </Sidebar.Footer> -->
</Sidebar.Root>
