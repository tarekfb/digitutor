<script lang="ts">
  import {
    Settings,
    LogOutIcon,
    NotepadText,
    X,
    Menu,
    Mail,
    DollarSign,
  } from "lucide-svelte";
  import type { Role } from "$lib/shared/models/profile";
  import { websiteName } from "$lib/shared/constants/constants";
  import Link from "../atoms/link.svelte";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import SidebarNav from "./sidebar-nav.svelte";
  import { fade } from "svelte/transition";
  import { Separator } from "../ui/separator";

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
        <SidebarNav href="/account/billing" {closeSidebar}>
          <DollarSign class={icon} />
          Betalningar
        </SidebarNav>
        <Separator />
        <SidebarNav disabled={logoutLoading} onClick={wrappedLogout}>
          {#if logoutLoading}
            <LoadingSpinner class="text-background" />
          {:else}
            <LogOutIcon size="18" />
            Logga ut
          {/if}
        </SidebarNav>
      </div>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
