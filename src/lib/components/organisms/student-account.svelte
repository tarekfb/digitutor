<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { mockConversations } from "src/lib/models/common.js";
  import { Circle } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import Title from "../atoms/title.svelte";
</script>

<Title>Dina konversationer</Title>
<div class="my-6">
  <div class="flex flex-col gap-y-4 mb-4">
    {#if mockConversations.length === 0}
      <p>Inga konversationer. Testa söka efter en lärare!</p>
    {:else}
      {#each mockConversations as conversation}
        <Card.Root>
          <Card.Header class="flex flex-col  space-y-0">
            <Card.Title>{conversation}</Card.Title>
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

  <Dialog.Root>
    <div class="flex justify-end w-full">
      <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
        Skapa annons
      </Dialog.Trigger>
    </div>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Skapa annons</Dialog.Title>
        <Dialog.Description>
          Du kan fylla i mer information om annonsen i nästa steg.
        </Dialog.Description>
      </Dialog.Header>
      <form method="POST" action="?/createListing">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="title" class="text-right">Rubrik</Label>
            <Input
              id="title"
              name="title"
              value="Test annons"
              class="col-span-3"
            />
          </div>
        </div>
        <Dialog.Footer>
          <Button type="submit">Skapa</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>
