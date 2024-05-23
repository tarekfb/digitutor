<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Circle } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Title from "../atoms/title.svelte";

  export let conversations;
</script>

<Title>Dina konversationer</Title>
<div class="flex flex-col gap-y-4 mb-4 my-6">
  {#if conversations.length === 0}
    <p>Inga konversationer. Testa söka efter en lärare!</p>
  {:else}
    {#each conversations as conversation}
      <Card.Root>
        <Card.Header class="flex flex-col  space-y-0">
          <Card.Title>{conversation.id}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="flex space-x-4 text-sm text-muted-foreground">
            <div class="flex items-center">
              <Circle class="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
              TypeScript
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    {/each}
  {/if}
</div>
