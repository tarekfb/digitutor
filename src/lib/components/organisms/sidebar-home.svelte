<script lang="ts">
  import Settings from "lucide-svelte/icons/settings";
  import LogOutIcon from "lucide-svelte/icons/log-out";
  import NotepadText from "lucide-svelte/icons/notepad-text";
  import X from "lucide-svelte/icons/x";
  import Mail from "lucide-svelte/icons/mail";
  import Menu from "lucide-svelte/icons/menu";
  import DollarSign from "lucide-svelte/icons/dollar-sign";
  import type { Profile, Role } from "$lib/shared/models/profile.ts";
  import { websiteName } from "$lib/shared/constants/constants.ts";
  import Link from "../atoms/link.svelte";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import SidebarNav from "./sidebar-nav.svelte";
  import { fade } from "svelte/transition";
  import { Separator } from "../ui/separator/index.ts";
  import SiteTitle from "../atoms/site-title.svelte";
  import { Button } from "../ui/button/index.ts";
  // import Js from "@icons-pack/svelte-simple-icons/icons/SiJavascript";
  // import Java from "@icons-pack/svelte-simple-icons/icons/SiJava";
  // import Css from "@icons-pack/svelte-simple-icons/icons/SiCss";
  import Csharp from "src/lib/icons/csharp.svelte";
  import Js from "src/lib/icons/js.svelte";
  import Python from "src/lib/icons/python.svelte";
  import Java from "src/lib/icons/java.svelte";
  import Html from "src/lib/icons/html.svelte";
  import Css from "src/lib/icons/css.svelte";
  import React from "src/lib/icons/react.svelte";
  import Search from "lucide-svelte/icons/search";
  import { goto } from "$app/navigation";

  export let profile: Profile | undefined;
  export let logout: () => void;

  let open = false;
  let logoutLoading = false;
  const closeSidebar = () => (open = false);

  const wrappedGoto = (url: string) => {
    goto(url);
    closeSidebar();
  };

  const wrappedLogout = () => {
    logoutLoading = true;
    logout();
    logoutLoading = false;
  };

  const icon = "size-5";
  const trigger = "size-7 text-muted-foreground";
</script>

<Sidebar.Root direction="right" bind:open>
  <Sidebar.Trigger class="hover:text-third" aria-label="Öppna meny">
    <Menu class={trigger} />
  </Sidebar.Trigger>
  <Sidebar.Content class="w-full rounded-none md:w-3/5 lg:w-2/5">
    <div
      transition:fade={{ duration: 300 }}
      class="w-full overflow-y-auto pb-4 *:px-4"
    >
      <Sidebar.Header class="relative flex items-center py-4">
        <SiteTitle />
        <Sidebar.Close class="m-0 ml-auto p-0" aria-label="Stäng meny"
          ><X class={trigger} /></Sidebar.Close
        >
      </Sidebar.Header>
      <Separator class="mb-4 px-0" />
      {#if profile}
        <div class="flex flex-col items-start gap-y-1">
          <SidebarNav href="/account" {closeSidebar}>
            <Mail class={icon} />
            Konversationer
          </SidebarNav>
          {#if profile.role === "teacher"}
            <SidebarNav href="/account/listings" {closeSidebar}>
              <NotepadText class={icon} />
              Annonser
            </SidebarNav>
          {/if}
          <SidebarNav href="/account/settings" {closeSidebar}>
            <Settings class={icon} />
            Inställningar
          </SidebarNav>
          {#if profile.role === "student"}
            <SidebarNav href="/account/billing" {closeSidebar}>
              <DollarSign class={icon} />
              Betalningar
            </SidebarNav>
          {/if}
        </div>
      {:else}
        <div class="flex flex-col items-start gap-y-2 *:w-full">
          <Button variant="third" on:click={() => wrappedGoto("/sign-up")}
            >Skapa konto gratis</Button
          >
          <Button class="outline" on:click={() => wrappedGoto("/sign-in")}
            >Logga in</Button
          >
          <Button
            variant="ghost"
            on:click={() => wrappedGoto("/sign-up?role=teacher")}
            >Skapa konto som lärare</Button
          >
        </div>
        <Separator class="my-2 px-0" />
      {/if}
      {#if !profile || profile.role === "student"}
        <SidebarNav href="/search?getAll=true" {closeSidebar}>
          <Search class={icon} />
          Se alla lärare
        </SidebarNav>
        <Separator class="mb-4 mt-2 px-0" />
        <div class="flex flex-col items-start gap-y-1">
          <h2 class="text-lg">Sök på ett språk eller ramverk</h2>
          <SidebarNav href="/search?q=javascript" {closeSidebar}>
            <Js width={20} height={20} />
            JavaScript
          </SidebarNav>
          <SidebarNav href="/search?q=python" {closeSidebar}>
            <Python width={20} height={20} />
            Python
          </SidebarNav>
          <SidebarNav href="/search?q=java" {closeSidebar}>
            <Java width={20} height={20} />
            Java
          </SidebarNav>
          <SidebarNav href="/search?q=csharp" {closeSidebar}>
            <Csharp width={20} height={20} />
            C#
          </SidebarNav>
          <SidebarNav href="/search?q=html" {closeSidebar}>
            <Html width={20} height={20} />
            Html
          </SidebarNav>
          <SidebarNav href="/search?q=css" {closeSidebar}>
            <Css width={20} height={20} />
            CSS
          </SidebarNav>
          <SidebarNav href="/search?q=react" {closeSidebar}>
            <React width={20} height={20} />
            React.JS
          </SidebarNav>
        </div>
      {/if}
      {#if profile}
        <Separator class="my-4 px-0" />
        <div class="flex flex-col items-start gap-y-1">
          <SidebarNav disabled={logoutLoading} onClick={wrappedLogout}>
            {#if logoutLoading}
              <LoadingSpinner class="text-background" />
            {:else}
              <LogOutIcon class={icon} />
              Logga ut
            {/if}
          </SidebarNav>
        </div>
      {/if}
    </div>
  </Sidebar.Content>
</Sidebar.Root>
