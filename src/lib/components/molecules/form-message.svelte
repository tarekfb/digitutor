<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { cn } from "$lib/utils.js";

  let className: string | null | undefined = undefined;
  export { className as class };
  export let message;
</script>

{#if $message}
  <div class={cn("", className)}>
    <Alert.Root variant={$message.variant ?? "default"} class="bg-card">
      <Alert.Title>{$message.title}</Alert.Title>
      <Alert.Description>
        {$message.description}
      </Alert.Description>
    </Alert.Root>
  </div>
{/if}
