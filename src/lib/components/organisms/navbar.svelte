<script lang="ts">
  // import Logo from "$lib/components/atoms/logo.svelte";
  import type { Profile } from "src/lib/shared/models/profile.ts";
  import SidebarHome from "./sidebar-home.svelte";
  import SiteTitle from "../atoms/site-title.svelte";
  import { Separator } from "../ui/separator/index.ts";

  export let profile: Profile | undefined | null | false;
  export let logout: (() => void) | false;

  const wrappedLogout = () => {
    if (!logout) return;
    logout();
  };

  const navItem = "px-4 py-2 text-muted-foreground md:hover:bg-primary/10";
</script>

<header
  class="sticky top-0 z-40 flex w-full flex-col overflow-x-hidden bg-background"
>
  <div
    class="flex w-full max-w-screen-2xl items-center justify-between gap-x-3 self-center px-4 py-4 sm:justify-between sm:space-x-0 md:h-20 md:px-4 lg:px-8"
  >
    <SiteTitle />
    <div
      class="my-2 hidden w-full max-w-screen-sm flex-col items-center justify-center self-center px-4 md:flex"
    >
      <slot name="search-form" />
    </div>
    <div class="flex items-center justify-end">
      <nav>
        <SidebarHome
          logout={wrappedLogout}
          profile={profile ? profile : undefined}
        />
      </nav>
    </div>
  </div>
  <Separator class="mb-2 w-full md:mb-0" />
  <div
    class="flex w-full max-w-screen-sm flex-col items-center justify-center self-center px-4 pb-4 pt-2 md:hidden"
  >
    <slot name="search-form" />
  </div>
  <nav
    class="hidden w-full max-w-screen-2xl items-center self-center px-4 md:flex"
  >
    <a href="/pricing" class={navItem}>Premium</a>
    {#if profile}
      <a href="/account" class={navItem}>Konto</a>
    {:else}
      <a href="/sign-up" class={navItem}>Skapa konto</a>
      <a href="/sign-in" class={navItem}>Logga in</a>
    {/if}
    {#if !profile || profile.role === "student"}
      <Separator orientation="vertical" class="py-3" />
      <a href="/search?q=javascript" class={navItem}>Javascript</a>
      <a href="/search?q=python" class={navItem}>Python</a>
      <a href="/search?q=java" class={navItem}>Java</a>
    {/if}
  </nav>
</header>
