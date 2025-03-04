<script lang="ts">
  import Settings from "lucide-svelte/icons/settings";
  import LogOutIcon from "lucide-svelte/icons/log-out";
  import NotepadText from "lucide-svelte/icons/notepad-text";
  import X from "lucide-svelte/icons/x";
  import Mail from "lucide-svelte/icons/mail";
  import Menu from "lucide-svelte/icons/menu";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import type { Role } from "$lib/shared/models/profile.ts";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import SidebarNav from "./sidebar-nav.svelte";
  import { fade } from "svelte/transition";
  import { Separator } from "../ui/separator/index.ts";
  import SiteTitle from "../atoms/site-title.svelte";

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

  const trigger = "size-7 text-muted-foreground";
  // todo delete this whole comp
</script>

<Sidebar.Root direction="right" bind:open>
  <Sidebar.Trigger class="hover:text-third" aria-label="Öppna meny">
    <Menu class="h-7 w-7" />
  </Sidebar.Trigger>
  <Sidebar.Content class="w-full rounded-none md:w-2/5 lg:w-1/5">
    <div transition:fade={{ duration: 300 }} class="w-full *:px-4">
      <Sidebar.Header class="relative flex items-center py-4">
        <SiteTitle />
        <Sidebar.Close class="m-0 ml-auto p-0" aria-label="Stäng meny"
          ><X class={trigger} /></Sidebar.Close
        >
      </Sidebar.Header>
      <Separator class="mb-4 px-0" />
      <div class="flex flex-col items-start gap-y-1">
        <SidebarNav href="/account" {closeSidebar}>
          <Mail class="size-button-icon" />
          Konversationer
        </SidebarNav>
        {#if role === "teacher"}
          <SidebarNav href="/account/listings" {closeSidebar}>
            <NotepadText class="size-button-icon" />
            Annonser
          </SidebarNav>
        {/if}
        <SidebarNav href="/account/settings" {closeSidebar}>
          <Settings class="size-button-icon" />
          Inställningar
        </SidebarNav>
        {#if role === "student"}
          <SidebarNav href="/account/billing" {closeSidebar}>
            <DollarSign class="size-button-icon" />
            Betalningar
          </SidebarNav>
        {/if}
      </div>
      <Separator class="my-4 px-0" />
      <SidebarNav disabled={logoutLoading} onClick={wrappedLogout}>
        {#if logoutLoading}
          <LoadingSpinner class="text-background" />
        {:else}
          <LogOutIcon class="size-button-icon" />
          Logga ut
        {/if}
      </SidebarNav>
    </div>
  </Sidebar.Content>
</Sidebar.Root>
