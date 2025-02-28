<script lang="ts">
  import MessageCircle from "lucide-svelte/icons/message-circle";
  import type { Message } from "$lib/shared/models/common.ts";
  import type { Writable } from "@square/svelte-store";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";
  import { MessageId } from "src/lib/shared/constants/constants.ts";
  import Link from "../atoms/link.svelte";

  let className: string | null | undefined = undefined;
  export { className as class };

  export let message: Writable<Message>;
  export let scroll = false;
  export let scrollTo: "start" | "end" = "start";
  let element: HTMLElement;
  $: $message, scrollIntoView();

  const scrollIntoView = () => {
    if (!scroll || !element || !$message) return; // fail proofing
    setTimeout(
      () => element.scrollIntoView({ behavior: "smooth", block: scrollTo }),
      1,
    );
  };
</script>

{#if $message}
  <div bind:this={element}>
    <AlertMessage
      title={$message.title}
      description={$message.description}
      variant={$message.variant ?? "default"}
      class={className}
    >
      {#if $message.id === MessageId.InsufficientCredits}
        <p class="inline text-sm">
          Du kan köpa mer krediter på <a
            href="/account/billing"
            class=" font-medium text-accent hover:underline">betalningar</a
          >, eller uppgradera till
          <a href="/pricing" class="font-medium text-accent hover:underline"
            >premium</a
          > för att kontakta läraren.
        </p>
      {/if}
      {#if $message.id === MessageId.ContactUs}
        <p class="inline text-xs md:text-sm">
          <Link
            href="/contact-us"
            class="flex-inline items-center space-x-2 font-normal text-inherit"
            target="_blank"
            ><span>Kontakta oss</span><MessageCircle
              class="inline size-4"
            /></Link
          >
        </p>
      {/if}
      <slot />
    </AlertMessage>
  </div>
{/if}

<!-- <Button size="icon" variant="ghost" class="absolute right-1 top-1">x</Button> -->
<!-- todo implement closeable -->
<!-- import { Button } from "$lib/components/ui/button/index.js"; -->
