<script lang="ts">
  import { WebsiteName } from "$lib/constants";
  import type { Tables } from "src/supabase";
  import AvatarPlaceholder from "$lib/components/avatar-placeholder.svelte";
  import { convertToInitials } from "$lib/helpers";

  export let profile: Tables<"profiles"> | null;
</script>

<div class="navbar bg-base-100 container mx-auto">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="/">{WebsiteName}</a>
  </div>

  {#if !profile}
    <ul class="menu menu-horizontal px-1 sm:hidden font-bold text-lg">
      <li class="md:mx-2">
        <a href="/login/sign_up" class="border border-primary">Sign up</a>
      </li>
    </ul>
  {/if}

  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 hidden sm:flex font-bold text-lg">
      <li class="md:mx-2"><a href="/pricing">Pricing</a></li>
      {#if profile}
        <li class="md:mx-2">
          <a href="/account/sign_out">Sign out</a>
        </li>
        <li class="md:mx-2">
          <a href="/account">
            <AvatarPlaceholder
              initials={profile.full_name
                ? convertToInitials(profile.full_name)
                : "?"}
              size={"w-8"}
            />
            Account
          </a>
        </li>
      {:else}
        <li class="md:mx-2">
          <a href="/login/sign_in">Log in</a>
        </li>
        <li class="md:mx-2">
          <a href="/login/sign_up" class="border border-primary">Sign up</a>
        </li>
      {/if}
    </ul>

    <div class="dropdown dropdown-end sm:hidden">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>

      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 font-bold"
      >
        <li><a href="/pricing">Pricing</a></li>
        {#if profile}
          <li class="md:mx-2">
            <a href="/account/sign_out">Sign out</a>
          </li>
          <li class="md:mx-2">
            <a href="/account">
              <AvatarPlaceholder
                initials={profile.full_name
                  ? convertToInitials(profile.full_name)
                  : "?"}
                size={"w-8"}
              />
              Account
            </a>
          </li>
        {:else}
          <li class="md:mx-2">
            <a href="/login/sign_in">Log in</a>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</div>
