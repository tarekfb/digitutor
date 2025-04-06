<script lang="ts">
  import type { Profile } from "src/lib/shared/models/profile.ts";
  import SidebarHome from "./sidebar-home.svelte";
  import SiteTitle from "../atoms/site-title.svelte";
  import { Separator } from "../ui/separator/index.ts";
  import { Button } from "../ui/button/index.ts";
  import { page } from "$app/stores";
  import { isReloadOnSearch } from "src/lib/shared/utils/utils.ts";

  export let profile: Profile | undefined | false;
  export let logout: (() => void) | false;

  const wrappedLogout = () => {
    if (!logout) return;
    logout();
  };

  const navItem =
    "px-4 py-2 text-muted-foreground md:hover:bg-third md:hover:text-background";
</script>

<header
  class="sticky top-0 z-40 flex w-full flex-col overflow-x-hidden bg-background"
>
  <div
    class="flex w-full max-w-screen-2xl items-center justify-between gap-x-3 self-center px-4 py-4 sm:justify-between sm:space-x-0 md:h-20 md:px-4 lg:px-8"
  >
    <SiteTitle />
    {#if $$slots.searchForm}
      <div
        class="my-2 hidden w-full max-w-screen-sm flex-col items-center justify-center self-center px-4 md:flex"
      >
        <slot name="searchForm" />
      </div>
    {/if}
    <nav class="flex items-center justify-end lg:hidden">
      <SidebarHome
        logout={wrappedLogout}
        profile={profile ? profile : undefined}
      />
    </nav>
    <nav class="hidden items-center justify-end gap-x-2 lg:flex">
      {#if profile !== false}
        {#if profile}
          <SidebarHome logout={wrappedLogout} {profile} />
        {:else}
          <Button variant="outline" href="/sign-in">Logga in</Button>
          <Button variant="third" href="/sign-up">Skapa gratis konto</Button>
        {/if}
      {/if}
    </nav>
  </div>
  <Separator class="mb-2 w-full md:mb-0" />
  {#if $$slots.searchForm}
    <div
      class="flex w-full max-w-screen-sm flex-col items-center justify-center self-center px-4 pb-4 pt-2 md:hidden"
    >
      <slot name="searchForm" />
    </div>
  {/if}
  <nav
    class="hidden w-full max-w-screen-2xl items-center self-center px-4 lg:flex"
  >
    {#if profile === undefined}
      <a href="/sign-up?role=teacher" class={navItem}>Skapa konto som lärare</a>
    {/if}
    {#if profile && profile.role === "student"}
      <a href="/pricing" class={navItem}>Premium</a>
    {/if}
    {#if profile === undefined || (profile && profile.role === "student")}
      <Separator orientation="vertical" class="py-3" />
    {/if}
    <a
      href="/search?getAll=true"
      data-sveltekit-reload={isReloadOnSearch($page.url.pathname)}
      class={navItem}>Se alla lärare</a
    >
    <a
      href="/search?q=javascript"
      data-sveltekit-reload={isReloadOnSearch($page.url.pathname)}
      class={navItem}>Lärare i Javascript</a
    >
    <a
      href="/search?q=python"
      data-sveltekit-reload={isReloadOnSearch($page.url.pathname)}
      class={navItem}>Lärare i Python</a
    >
    <a
      href="/search?q=java"
      data-sveltekit-reload={isReloadOnSearch($page.url.pathname)}
      class={navItem}>Lärare i Java</a
    >
  </nav>
</header>
