<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar";
  import { convertToInitials } from "src/lib/shared/utils/utils";
  import { cn } from "src/lib/shared/utils/utils.js";

  let className: string | null | undefined = undefined;
  export let fallbackClass: string | null | undefined = undefined;
  export { className as class };

  export let href: string = "";
  export let url: string | null = "";
  export let role: "teacher" | "student" | "admin" | "" = "";
  export let firstName: string;
  export let lastName: string;
  export let size = "10";

  let initials = convertToInitials(firstName, lastName);

  const fallback = `text-background bg-accent w-${size} h-${size}`;
</script>

<Avatar.Root
  data-testid="avatar"
  class={cn(
    `flex justify-center text-lg items-center font-normal h-${size} w-${size}`,
    className,
  )}
>
  {#if href && role === "teacher"}
    <a {href}>
      {#if url}
        <Avatar.Image src={url} alt="profilbild" />
      {:else}
        <Avatar.Fallback class={cn(fallback, fallbackClass)}
          >{initials}</Avatar.Fallback
        >
      {/if}
    </a>
  {:else if url}
    <Avatar.Image src={url} alt="profilbild" />
  {:else}
    <Avatar.Fallback class={cn(fallback, fallbackClass)}
      >{initials}</Avatar.Fallback
    >
  {/if}
</Avatar.Root>
