<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { UserRound, LogOutIcon } from "lucide-svelte";
  // import Logo from "$lib/components/atoms/logo.svelte";
  import { goto } from "$app/navigation";
  import type { Tables } from "src/supabase";
  import { websiteName } from "../../shared/constants/constants";
  import Avatar from "../atoms/avatar.svelte";
  import LoadingSpinner from "../atoms/loading-spinner.svelte";

  export let profile: Tables<"profiles"> | undefined | null | false;
  export let logout: (() => void) | false;

  let logoutLoading = false;
  const wrappedLogout = () => {
    if (!logout) return;
    logoutLoading = true;
    logout();
    logoutLoading = false;
  };
</script>

<header
  class="sticky top-0 z-40 w-full bg-accent text-background overflow-x-hidden h-16 md:h-20 flex items-center gap-x-3 sm:justify-between sm:space-x-0 px-2 md:px-4 lg:px-8"
>
  <a href="/" class="text-3xl md:text-5xl font-semibold hover:text-primary">
    {websiteName}
  </a>
  <div class="flex-1 flex items-center justify-end">
    <nav class="flex items-center gap-x-2 md:gap-x-4">
      {#if profile !== false}
        {#if profile === undefined || profile === null}
          <Button
            variant="ghost"
            class="px-2 md:px-3"
            on:click={() => goto("/sign-in")}>Logga in</Button
          >
          <Button on:click={() => goto("/sign-up")} class="px-2 md:px-3"
            >Skapa konto</Button
          >
        {:else if profile}
          <Button on:click={() => goto("/account")}>
            <UserRound class="mr-2 h-4 w-4" />
            Konto
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                variant="ghost"
                builders={[builder]}
                class="relative h-8 w-8 rounded-full mx-1"
              >
                <Avatar
                  url={profile.avatar_url ?? ""}
                  firstName={profile.first_name}
                  lastName={profile.last_name}
                  role={profile.role}
                  onClick={undefined}
                  fallbackClass="bg-primary"
                />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56" align="end">
              <DropdownMenu.Label class="font-normal">
                <p class="text-sm font-medium leading-none">
                  {profile.first_name}
                </p>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item class="data-[highlighted]:bg-white">
                <button
                  class="flex gap-x-2 w-full items-center"
                  disabled={logoutLoading}
                  on:click={() => goto("/account")}
                >
                  <UserRound class="mr-2 h-4 w-4" />
                  Konto
                </button>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item class="data-[highlighted]:bg-white">
                <button
                  class="flex gap-x-2 w-full items-center"
                  disabled={logoutLoading}
                  on:click={wrappedLogout}
                >
                  {#if logoutLoading}
                    <LoadingSpinner class="text-background mr-2" />
                  {:else}
                    <LogOutIcon size="18" class="mr-2" />
                  {/if}
                  Logga ut
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
      {/if}
    </nav>
    <nav>
      <slot />
    </nav>
  </div>
</header>
