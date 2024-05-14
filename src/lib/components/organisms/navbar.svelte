<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Avatar from "$lib/components/ui/avatar";
  import { UserRound, LogOut } from "lucide-svelte";
  // import Logo from "$lib/components/logo/logo.svelte";
  import { goto } from "$app/navigation";
  import { convertToInitials } from "$lib/utils";
  import type { Tables } from "src/supabase";
  import { websiteName } from "../../constants";

  export let profile: Tables<"profiles"> | null;

  let initials: string = "";
  $: {
    if (profile && profile)
      initials = profile.full_name ? convertToInitials(profile.full_name) : "?";
  }
</script>

<header class="sticky top-0 z-40 w-full bg-primary text-background">
  <div
    class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0"
  >
    <a href="/" class="text-2xl font-semibold">
      {websiteName}
    </a>
    <div class="flex flex-1 items-center justify-end space-x-4">
      <nav class="flex items-center space-x-1">
        {#if !profile}
          <Button on:click={() => goto("/login/sign_up")}>Sign up</Button>
          <Button on:click={() => goto("/login/sign_in")}>Log in</Button>
        {:else}
          <Button on:click={() => goto("/account")}>
            <UserRound class="mr-2 h-4 w-4" />
            Account
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                variant="ghost"
                builders={[builder]}
                class="relative h-8 w-8 rounded-full"
              >
                <Avatar.Root
                  class="h-8 w-8 flex justify-center text-xs items-center"
                >
                  <Avatar.Fallback class="bg-accent text-background"
                    >{convertToInitials(
                      profile.full_name ?? "? ?",
                    )}</Avatar.Fallback
                  >
                </Avatar.Root>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-56" align="end">
              <DropdownMenu.Label class="font-normal">
                <p class="text-sm font-medium leading-none">
                  {profile?.full_name}
                </p>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item on:click={() => goto("/account/sign_out")}>
                <LogOut class="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {/if}
      </nav>
    </div>
  </div>
</header>
