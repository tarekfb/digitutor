<script lang="ts">
  import type { Profile } from "src/lib/shared/models/profile";
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
    class={cn("flex gap-x-2 items-center self-start", className)}
  >
    <Avatar
      url={profile.avatarUrl ?? ""}
      firstName={profile.firstName}
      lastName={profile.lastName}
      role={profile.role}
    />
    <slot />
  </a>
{:else}
  <div class={cn("flex gap-x-2 items-center self-start", className)}>
    <Avatar
      url={profile.avatarUrl ?? ""}
      firstName={profile.firstName}
      lastName={profile.lastName}
      role={profile.role}
    />
    <slot />
  </div>
{/if}
