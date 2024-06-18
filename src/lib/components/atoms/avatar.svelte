<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { convertToInitials } from "$lib/utils";
  import { cn } from "$lib/utils.js";
  import type { Tables } from "src/supabase";

  interface OnClick {
    onClick?: () => void;
  }

  let className: string | null | undefined = undefined;
  export let fallbackClass: string | null | undefined = undefined;
  export { className as class };

  export let onClick: OnClick["onClick"];
  export let profile: Tables<"profiles">;

  let initials = convertToInitials(profile.first_name, profile.last_name);

  const base = "flex justify-center text-lg items-center font-normal";
  const size = "h-10 w-10";
  const fallback =
    "text-background bg-accent " + (fallbackClass ? ` ${fallbackClass}` : "");
</script>

{#if onClick && profile.role === "teacher"}
  <Button
    variant="ghost"
    class={cn(`relative rounded-full ${size}`, className)}
    on:click={onClick}
  >
    <Avatar.Root class={base}>
      <Avatar.Fallback class={fallback}>{initials}</Avatar.Fallback>
    </Avatar.Root>
  </Button>
{:else}
  <Avatar.Root class={cn(`${size} ${base}`, className)}>
    <Avatar.Fallback class={fallback}>{initials}</Avatar.Fallback>
  </Avatar.Root>
{/if}
