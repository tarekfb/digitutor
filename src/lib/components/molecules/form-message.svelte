<script lang="ts">
  import type { Message } from "$lib/shared/models/common";
  import type { Writable } from "svelte/store";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";

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
      <slot />
    </AlertMessage>
  </div>
{/if}

<!-- <Button size="icon" variant="ghost" class="absolute right-1 top-1">x</Button> -->
<!-- todo implement closeable -->
<!-- import { Button } from "$lib/components/ui/button"; -->
