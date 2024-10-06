<script lang="ts">
  import { convertToInitials } from "$lib/utils.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Settings, LogOutIcon, Home, X, Menu } from "lucide-svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import type { Role } from "$lib/shared/models/profile";
  import { websiteName } from "$lib/shared/constants/constants";
  import type { Conversation } from "src/lib/shared/models/conversation";
  import Link from "../atoms/link.svelte";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { mediaQuery } from "svelte-legos";
  import SidebarNav from "./sidebar-nav.svelte";
  import { fade } from "svelte/transition";

  export let role: Role | undefined;
  export let conversations: Conversation[];
  export let logout: () => void;

  const isDesktop = mediaQuery("(min-width: 768px)");

  let open = false;
  let logoutLoading = false;

  const wrappedLogout = () => {
    logoutLoading = true;
    logout();
    logoutLoading = false;
  };

  const title =
    "text-lg font-semibold tracking-tight overflow-x-hidden text-ellipsis whitespace-nowrap mb-2 px-1.5";
</script>

<Sidebar.Root direction="right" bind:open>
  <Sidebar.Trigger
    class="absolute right-5 top-5 hover:text-accent active:text-accent"
    aria-label="Öppna meny"
  >
    <Menu class="h-7 w-7" />
  </Sidebar.Trigger>
  <Sidebar.Content
    class="rounded-none w-4/5 {$isDesktop ? 'md:w-2/5 lg:w-1/5' : 'swipable'} px-2"
  >
    <div transition:fade={{ duration: 300 }}>
      <Sidebar.Header class="relative flex items-center justify-center py-2 mb-4">
        <Sidebar.Close
          class="absolute {$isDesktop
            ? 'left-0'
            : '-left-10'} m-0 p-0 hover:text-accent active:text-accent"
          aria-label="Stäng meny"><X class="w-7 h-7" /></Sidebar.Close
        >
        <Link
          href="/"
          class="hover:text-primary hover:no-underline active:text-primary"
        >
          <Sidebar.Title class="text-3xl">{websiteName}</Sidebar.Title>
        </Link>
      </Sidebar.Header>
      <div class="flex flex-col items-start gap-y-1">
        <SidebarNav href="/account" closeSidebar={() => (open = false)}>
          <Home class="h-5 w-5" />
          Dashboard
        </SidebarNav>
        <SidebarNav
          href="/account/settings"
          closeSidebar={() => (open = false)}
        >
          <Settings class="h-5 w-5" />
          Inställningar
        </SidebarNav>
        <SidebarNav disabled={logoutLoading} onClick={wrappedLogout}>
          {#if logoutLoading}
            <LoadingSpinner class="text-background" />
          {:else}
            <LogOutIcon size="18" />
            Logga ut
          {/if}
        </SidebarNav>
        {#if role === "teacher"}
          <h2 class="relative {title}">Konversationer</h2>
          <ScrollArea class="max-h-96">
            <ul class="space-y-1">
              {#each conversations as conversation}
                <li>
                  <SidebarNav
                    href="/account/settings"
                    closeSidebar={() => (open = false)}
                  >
                    <Avatar.Root
                      class="h-6 w-6 flex justify-center items-center mr-2"
                    >
                      <Avatar.Fallback
                        class="bg-accent text-background text-xs"
                      >
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
              {:else}
                <p class="text-md px-1.5">Inga konversationer ännu.</p>
              {/each}
            </ul>
          </ScrollArea>
        {/if}
      </div>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
