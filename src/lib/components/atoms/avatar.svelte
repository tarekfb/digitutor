<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import { Button } from "$lib/components/ui/button";
  import { convertToInitials } from "$lib/utils";
  import { cn } from "$lib/utils.js";

  interface OnClick {
    onClick?: () => void;
  }

  let className: string | null | undefined = undefined;
  export { className as class };
  export let firstName: string;
  export let lastName: string;
  export let onClick: OnClick["onClick"];

  let initials = convertToInitials(firstName, lastName);
</script>

{#if onClick}
  <Button
    variant="ghost"
    class={cn("relative h-8 w-8 rounded-full", className)}
    on:click={onClick}
  >
    <Avatar.Root class="flex justify-center text-lg items-center ">
      <Avatar.Fallback class="text-background bg-accent"
        >{initials}</Avatar.Fallback
      >
    </Avatar.Root>
  </Button>
{:else}
  <Avatar.Root
    class={cn("h-8 w-8 flex justify-center text-lg items-center", className)}
  >
    <Avatar.Fallback class="text-background bg-accent"
      >{initials}</Avatar.Fallback
    >
  </Avatar.Root>
{/if}
