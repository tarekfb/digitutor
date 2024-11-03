<script lang="ts">
  import type { Tables } from "src/supabase";
  import Avatar from "../atoms/avatar.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";

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
    <Avatar
      onClick={undefined}
      url={profile.avatar_url ?? ""}
      firstName={profile.first_name}
      lastName={profile.last_name}
      role={profile.role}
    />
    <slot />
  </a>
{:else}
  <div class={cn("flex gap-x-2 items-center self-start", className)}>
    <Avatar
      onClick={undefined}
      url={profile.avatar_url ?? ""}
      firstName={profile.first_name}
      lastName={profile.last_name}
      role={profile.role}
    />
    <slot />
  </div>
{/if}
