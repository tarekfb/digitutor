<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { convertToInitials } from "$lib/utils";
  import { cn } from "$lib/utils.js";

  interface OnClick {
    onClick?: () => void;
  }

  let className: string | null | undefined = undefined;
  export let fallbackClass: string | null | undefined = undefined;
  export { className as class };

  export let onClick: OnClick["onClick"];
  export let url: string;
  export let role: "teacher" | "student" | "" = "";
  export let firstName: string;
  export let lastName: string;

  let initials = convertToInitials(firstName, lastName);

  const base = "flex justify-center text-lg items-center font-normal";
  const size = "50";
  const fallback =
    "text-background bg-accent " + (fallbackClass ? ` ${fallbackClass}` : "");
</script>

{#if onClick && role === "teacher"}
  <Button
    variant="ghost"
    data-testid="avatar"
    class={cn(`relative rounded-full`, className)}
    on:click={onClick}
  >
    <Avatar.Root class={base}>
      {#if url}
        <Avatar.Image src={url} alt="profilbild" width={size} height={size} />
      {/if}
      <Avatar.Fallback class={fallback}>{initials}</Avatar.Fallback>
    </Avatar.Root>
  </Button>
{:else}
  <Avatar.Root class={cn(`${base}`, className)} data-testid="avatar">
    {#if url}
      <Avatar.Image src={url} alt="profilbild" width={size} height={size} />
    {/if}
    <Avatar.Fallback class={fallback}>{initials}</Avatar.Fallback>
  </Avatar.Root>
{/if}
