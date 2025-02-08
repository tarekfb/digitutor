<script lang="ts">
  import Settings from "lucide-svelte/icons/settings";
  import LogOutIcon from "lucide-svelte/icons/log-out";
  import NotepadText from "lucide-svelte/icons/notepad-text";
  import X from "lucide-svelte/icons/x";
  import Mail from "lucide-svelte/icons/mail";
  import Menu from "lucide-svelte/icons/menu";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import type { Role } from "$lib/shared/models/profile.ts";
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import Link from "../atoms/link.svelte";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import SidebarNav from "./sidebar-nav.svelte";
  import { fade } from "svelte/transition";
  import { Separator } from "../ui/separator/index.ts";

  export let role: Role | undefined;
  export let logout: () => void;

  let open = false;
  let logoutLoading = false;
  const closeSidebar = () => (open = false);

  const wrappedLogout = () => {
    logoutLoading = true;
    logout();
    logoutLoading = false;
  };

  const icon = "w-5 h-5";
</script>

<Sidebar.Root direction="right" bind:open>
  <Sidebar.Trigger class="hover:text-third" aria-label="Öppna meny">
    <Menu class="h-7 w-7" />
  </Sidebar.Trigger>
  <Sidebar.Content class="w-3/5 rounded-none px-2 md:w-2/5 lg:w-1/5">
    <div transition:fade={{ duration: 300 }} class="w-full">
      <Sidebar.Header
        class="relative mb-4 flex items-center justify-center py-2"
      >
        <Sidebar.Close
          class="absolute left-0 m-0 p-0 hover:text-accent active:text-accent"
          aria-label="Stäng meny"><X class="h-7 w-7" /></Sidebar.Close
        >
        <Link
          href="/"
          class="hover:text-primary hover:no-underline active:text-primary"
        >
          <Sidebar.Title class="text-3xl">{websiteName}</Sidebar.Title>
        </Link>
      </Sidebar.Header>
      <div class="flex flex-col items-start gap-y-1">
        <SidebarNav href="/account" {closeSidebar}>
          <Mail class={icon} />
          Konversationer
        </SidebarNav>
        {#if role === "teacher"}
          <SidebarNav href="/account/listings" {closeSidebar}>
            <NotepadText class={icon} />
            Annonser
          </SidebarNav>
        {/if}
        <SidebarNav href="/account/settings" {closeSidebar}>
          <Settings class={icon} />
          Inställningar
        </SidebarNav>
        {#if role === "student"}
          <SidebarNav href="/account/billing" {closeSidebar}>
            <DollarSign class={icon} />
            Betalningar
          </SidebarNav>
        {/if}
        <Separator />
        <SidebarNav disabled={logoutLoading} onClick={wrappedLogout}>
          {#if logoutLoading}
            <LoadingSpinner class="text-background" />
          {:else}
            <LogOutIcon class={icon} />
            Logga ut
          {/if}
        </SidebarNav>
      </div>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
