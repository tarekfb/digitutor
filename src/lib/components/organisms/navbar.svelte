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
  class="sticky top-0 z-40 w-full bg-gradient-to-r from-primary to-accent text-background overflow-x-hidden"
>
  <div
    class="container flex h-16 items-center space-x-3 sm:justify-between sm:space-x-0"
  >
    <a
      href="/"
      class="text-2xl font-semibold hover:text-accent"
    >
      {websiteName}
    </a>
    <div class="flex flex-1 items-center justify-end space-x-4">
      <nav class="flex items-center space-x-4">
        {#if profile !== false}
          <!-- content here -->
          {#if profile === undefined || profile === null}
            <Button variant="ghost" on:click={() => goto("/sign-in")}
              >Logga in</Button
            >
            <Button on:click={() => goto("/sign-up")} class="px-2.5 md:px-3"
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
                  class="relative h-8 w-8 rounded-full"
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
                    class="flex space-x-2 w-full"
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
                    class="flex space-x-2 w-full"
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
  </div>
</header>
