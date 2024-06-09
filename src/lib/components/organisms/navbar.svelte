<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { UserRound, LogOut } from "lucide-svelte";
  // import Logo from "$lib/components/atoms/logo.svelte";
  import { goto } from "$app/navigation";
  import type { Tables } from "src/supabase";
  import { websiteName } from "../../constants";
  import Avatar from "../atoms/avatar.svelte";

  export let profile: Tables<"profiles"> | null;
</script>

<header
  class="sticky top-0 z-40 w-full bg-gradient-to-r from-primary to-accent text-background px-1"
>
  <div
    class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0"
  >
    <a href="/" class="text-2xl font-semibold">
      {websiteName}
    </a>
    <div class="flex flex-1 items-center justify-end space-x-4">
      <nav class="flex items-center space-x-4">
        {#if !profile}
          <Button variant="ghost" on:click={() => goto("/login/sign_in")}
            >Logga in</Button
          >
          <Button on:click={() => goto("/login/sign_up")}>Skapa konto</Button>
        {:else}
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
                  {profile}
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
              <DropdownMenu.Item on:click={() => goto("/account/sign_out")}>
                <LogOut class="mr-2 h-4 w-4" />
                Logga ut
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
      </nav>
    </div>
  </div>
</header>
