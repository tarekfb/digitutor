<script lang="ts">
  // import { cubicInOut } from "svelte/easing";
  // import { crossfade } from "svelte/transition";
  // import { page } from "$app/stores";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { goto } from "$app/navigation";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  export let conversations: string[] = [];
  let className: string | null | undefined = undefined;
  export { className as class };
  let isMinimized = true;

  // let className: string | undefined | null = undefined;
  // export let items: { href: string; title: string }[];
  // export { className as class };

  // const [send, receive] = crossfade({
  //   duration: 250,
  //   easing: cubicInOut,
  // });
</script>

<!-- 
<nav class={cn("flex flex-col space-x-0 sm:flex-row  sm:space-x-2", className)}>
  {#each items as item}
    {@const isActive = $page.url.pathname === item.href}

    <Button
      href={item.href}
      variant="ghost"
      class={cn(
        !isActive && "hover:underline",
        "relative justify-start hover:bg-transparent",
      )}
      data-sveltekit-noscroll
    >
      {#if isActive}
        <div
          class="absolute inset-0 rounded-md bg-muted"
          in:send={{ key: "active-sidebar-tab" }}
          out:receive={{ key: "active-sidebar-tab" }}
        />
      {/if}
      <div class="relative">
        {item.title}
      </div>
    </Button>
  {/each}
</nav> -->

<div
  class={cn(
    `${isMinimized ? "w-14" : "w-32"} z-10 bg-slate-100 overflow-x-hidden fixed h-full left-0 top-0 pb-12`,
    className,
  )}
>
  <div class="space-y-2 py-2">
    <a href="/" class="">
      <h1 class="text-3xl px-2">M</h1>
    </a>
    <div class="flex items-center space-x-2 px-2">
      <Switch id="airplane-mode" bind:checked={isMinimized} />
      <Label for="airplane-mode">Visa</Label>
    </div>
    <div>
      <h2 class="px-3 text-lg font-semibold tracking-tight">Dashboard</h2>
      <div class="space-y-1">
        <Button
          variant="secondary"
          class="w-full justify-start"
          on:click={() => goto("/account")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 h-4 w-4"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
          {#if !isMinimized}
            Annonser
          {/if}
        </Button>
        <Button
          variant="ghost"
          class="w-full justify-start"
          on:click={() => goto("/billing")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 h-4 w-4"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          {#if !isMinimized}
            Billing
          {/if}
        </Button>
        <Button
          variant="ghost"
          class="w-full justify-start"
          on:click={() => goto("/settings")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mr-2 h-4 w-4"
          >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
          </svg>
          {#if !isMinimized}
            Inställningar
          {/if}
        </Button>
      </div>
    </div>
    <div class="py-2">
      <h2 class="relative px-3 text-lg font-semibold tracking-tight">
        Meddelanden
      </h2>
      <ScrollArea class="h-[300px] ">
        <div class="space-y-1">
          {#each conversations as conversation}
            <Button variant="ghost" class="w-full justify-start font-normal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mr-2 h-4 w-4"
              >
                <path d="M21 15V6" />
                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" />
                <path d="M16 6H3" />
                <path d="M12 18H3" />
              </svg>
              {conversation}
            </Button>
          {/each}
        </div>
      </ScrollArea>
    </div>
  </div>
</div>
