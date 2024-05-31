<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let message;
  let element: HTMLElement;
  export let scroll = false;

  $: $message, scrollIntoView();

  const scrollIntoView = () => {
    if (!scroll) return;
    if (!$message) return;
    setTimeout(
      () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
      1,
    );
  };
</script>

{#if $message}
  <div class={cn("text-center", className)} bind:this={element}>
    <Alert.Root variant={$message.variant ?? "default"} class="bg-card">
      <Alert.Title>{$message.title}</Alert.Title>
      <Alert.Description>
        {$message.description}
      </Alert.Description>
    </Alert.Root>
  </div>
{/if}

<!-- <Button size="icon" variant="ghost" class="absolute right-1 top-1">x</Button> -->
<!-- todo implement closeable -->
<!-- import { Button } from "$lib/components/ui/button"; -->
