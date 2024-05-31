<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Circle } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Title from "../atoms/primary-title.svelte";
  import { goto } from "$app/navigation";
  import { SquareArrowOutUpRight } from 'lucide-svelte';

  export let conversations;
</script>

<Title>Dina konversationer</Title>
<div class="flex flex-col items-center gap-y-4 my-6">
  {#if conversations.length === 0}
    <p>Inga konversationer. Testa söka efter en lärare!</p>
  {:else}
    {#each conversations as conversation}
      <Card.Root>
        <Card.Header class="flex flex-col  space-y-0">
          <Card.Title>{conversation.id}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="flex space-x-4 justify-between text-sm text-muted-foreground">
            <div class="flex items-center">
              <Circle class="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              TypeScript
            </div>
            <Button size="icon" on:click={() => goto("/account/conversation/" + conversation.id)}>
            <SquareArrowOutUpRight /></Button>
          </div>
        </Card.Content>
      </Card.Root>
    {/each}
  {/if}
</div>
