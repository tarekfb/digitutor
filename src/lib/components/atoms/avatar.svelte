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
  const size = "h-10 w-10";
  const fallback =
    "text-background bg-accent " + (fallbackClass ? ` ${fallbackClass}` : "");
</script>

{#if onClick && role === "teacher"}
  <Button
    variant="ghost"
    class={cn(`relative rounded-full ${size}`, className)}
    on:click={onClick}
  >
    <Avatar.Root class={base}>
      {#if url}
        <Avatar.Image src={url} alt="profilbild" />
      {/if}
      <Avatar.Fallback class={fallback}>{initials}</Avatar.Fallback>
    </Avatar.Root>
  </Button>
{:else}
  <Avatar.Root class={cn(`${size} ${base}`, className)}>
    {#if url}
      <Avatar.Image src={url} alt="profilbild" />
    {/if}
    <Avatar.Fallback class={fallback}>{initials}</Avatar.Fallback>
  </Avatar.Root>
{/if}
