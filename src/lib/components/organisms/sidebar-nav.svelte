<script lang="ts">
  import { cn, convertToInitials } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { goto } from "$app/navigation";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { DollarSign, Settings } from "lucide-svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import type { Role } from "src/lib/models/user";
  import ListingNav from "./listing-nav.svelte";
  import ConversationsNav from "./conversations-nav.svelte";
  import Separator from "../ui/separator/separator.svelte";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let role: Role;
  export let conversations: string[] = [];
  let isMinimized = true;
</script>

<div
  class={cn(
    `${isMinimized ? "w-14" : "w-3/4"} z-10 bg-card overflow-x-hidden fixed h-full left-0 top-0 pb-12 border border-r-foreground`,
    className,
  )}
>
  <div class="space-y-2 py-2">
    <a href="/" class="">
      <h1 class="text-3xl px-2">
        {#if isMinimized}
          M
        {:else}
          Mindic
        {/if}
      </h1>
    </a>
    <div class="flex items-center space-x-2 px-2">
      <Switch id="airplane-mode" bind:checked={isMinimized} />
      <Label for="airplane-mode">Dölj</Label>
    </div>
    <Separator />
    <div>
      <h2
        class="px-3 text-lg font-semibold tracking-tight overflow-x-hidden text-ellipsis whitespace-nowrap"
      >
        Dashboard
      </h2>
      <div class="space-y-1">
        {#if role === "teacher"}
          <ListingNav {isMinimized} />
        {:else}
          <ConversationsNav {isMinimized} />
          <Button
            variant="ghost"
            class="w-full justify-start"
            on:click={() => goto("/account/billing")}
          >
            <DollarSign class="h-5 w-5 mr-1" />
            {#if !isMinimized}
              Billing
            {/if}
          </Button>
        {/if}
        <Button
          variant="ghost"
          class="w-full justify-start"
          on:click={() => goto("/account/settings")}
        >
          <Settings class="h-5 w-5 mr-1" />
          {#if !isMinimized}
            Inställningar
          {/if}
        </Button>
      </div>
    </div>
    {#if role === "teacher"}
      <Separator />
      <div class="py-2">
        <h2
          class="relative px-3 text-lg font-semibold tracking-tight overflow-x-hidden text-ellipsis whitespace-nowrap"
        >
          Konversationer
        </h2>
        <ScrollArea class="h-96">
          <div class="space-y-1">
            {#each conversations as conversation}
              <Button variant="ghost" class="w-full justify-start font-normal">
                <Avatar.Root
                  class="h-6 w-6 flex justify-center items-center mr-2"
                >
                  <Avatar.Fallback class="bg-accent text-background text-xs"
                    >{convertToInitials(
                      conversation.split(" ")[0],
                      conversation.split(" ")[1],
                    )}</Avatar.Fallback
                  >
                </Avatar.Root>
                {#if !isMinimized}
                  {conversation}
                {/if}
              </Button>
            {/each}
          </div>
        </ScrollArea>
      </div>
      <Separator />
    {/if}
  </div>
</div>
