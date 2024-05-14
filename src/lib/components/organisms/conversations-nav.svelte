<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { MessageCircle } from "lucide-svelte";

  export let isMinimized: boolean;
</script>

<Button
  variant="secondary"
  class="w-full justify-start"
  on:click={() => goto("/account")}
>
  <MessageCircle class="h-5 w-5 mr-1" />

  {#if !isMinimized}
    Konversationer
  {/if}
</Button>
