<script lang="ts">
  import type { Profile } from "src/lib/shared/models/profile.ts";
  import Avatar from "../atoms/avatar.svelte";
  import { cn } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let profile: Profile;
  export let clickable = false;
</script>

{#if profile.role === "teacher" && clickable}
  <a
    href="/profile/{profile.id}"
    aria-label="Gå till lärarens profil"
    class={cn("flex items-center gap-x-2 self-start", className)}
  >
    <Avatar
      url={profile.avatarUrl ?? ""}
      firstName={profile.firstName}
      role={profile.role}
    />
    <slot />
  </a>
{:else}
  <div class={cn("flex items-center gap-x-2 self-start", className)}>
    <Avatar
      url={profile.avatarUrl ?? ""}
      firstName={profile.firstName}
      role={profile.role}
    />
    <slot />
  </div>
{/if}
