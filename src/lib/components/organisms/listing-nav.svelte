<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { FileText } from "lucide-svelte";

  export let isMinimized: boolean;
</script>

<Button
  variant="ghost"
  class="w-full justify-start"
  on:click={() => goto("/account")}
>
  <FileText class="h-5 w-5 mr-1" />

  {#if !isMinimized}
    Annonser
  {/if}
</Button>
