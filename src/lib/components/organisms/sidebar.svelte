<script lang="ts">
  import { convertToInitials } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { goto } from "$app/navigation";
  import { Settings, LogOutIcon, Home, X, Menu } from "lucide-svelte";
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
    "text-lg font-semibold tracking-tight overflow-x-hidden text-ellipsis whitespace-nowrap mb-2";
</script>

<Sidebar.Root direction="right" bind:open={isMinimized}>
  <Sidebar.Trigger
    class="absolute right-5 top-5 hover:text-accent active:text-accent"
    aria-label="Öppna meny"
  >
    <Menu class="h-7 w-7" />
  </Sidebar.Trigger>
  <Sidebar.Content
    class="rounded-none w-4/5 {$isDesktop ? 'w-1/5' : 'swipable'} px-2"
  >
    <Sidebar.Header class="relative flex items-center justify-center py-1">
      <Sidebar.Close
        class="absolute {$isDesktop
          ? 'left-0'
          : '-left-10'} m-0 p-0 hover:text-accent active:text-accent"
        aria-label="Stäng meny"><X /></Sidebar.Close
      >
      <Link
        href="/"
        class="hover:text-primary hover:no-underline active:text-primary"
      >
        <Sidebar.Title class="text-3xl">{websiteName}</Sidebar.Title>
      </Link>
    </Sidebar.Header>
    <div class="flex flex-col items-start gap-y-2">
      <SidebarNav href="/account">
        <Home class="h-5 w-5" />
        Dashboard
      </SidebarNav>
      <SidebarNav href="/account/settings">
        <Settings class="h-5 w-5" />
        Inställningar
      </SidebarNav>
      <Button
        variant="link"
        class="gap-x-1 p-0 text-foreground tracking-normal text-base normal-case hover:text-accent active:text-accent hover:no-underline"
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
      {#if role === "teacher"}
        <Separator />
        <h2 class="relative {title}">Konversationer</h2>
        <ScrollArea class="max-h-96">
          <ul class="space-y-1">
            {#each conversations as conversation}
              <li>
                <SidebarNav href="/account/settings">
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
                </SidebarNav>
              </li>
              <!-- <Button
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
              </Button> -->
            {:else}
              <p class="text-md">Inga konversationer ännu.</p>
            {/each}
          </ul>
        </ScrollArea>
      {/if}
    </div>
  </Sidebar.Content>
  <!-- <Sidebar.Footer>
      <Button>Submit</Button>
      <Sidebar.Close>Cancel</Sidebar.Close>
    </Sidebar.Footer> -->
</Sidebar.Root>
