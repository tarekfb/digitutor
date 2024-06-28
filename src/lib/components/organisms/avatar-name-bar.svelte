<script lang="ts">
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let profile: Tables<"profiles">;
  export let clickable = false;
</script>

{#if profile.role === "teacher" && clickable}
  <a
    href="/profile/{profile.id}"
    aria-label="Gå till lärarens profil"
    class={cn("flex gap-x-2 items-center self-start", className)}
  >
    <Avatar onClick={() => goto(`/profile/${profile.id}`)} {profile} />
    <slot />
  </a>
{:else}
  <div class={cn("flex gap-x-2 items-center self-start", className)}>
    <Avatar onClick={() => goto(`/profile/${profile.id}`)} {profile} />
    <slot />
  </div>
{/if}
