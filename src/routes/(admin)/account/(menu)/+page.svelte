<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  // import { IconCurrencyKroneSwedish } from "@tabler/icons-svelte";
  // import { IconHeading } from "@tabler/icons-svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-1">Dashboard</h1>

<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Annonser</h1>
  <p>Här ska annonserna in</p>

  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "default" })}
      >Skapa annons</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Du kan fylla i mer information om annonsen i nästa steg.
        </Dialog.Description>
      </Dialog.Header>
      <form method="POST" action="?/signout">
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="title" class="text-right">Rubrik</Label>
            <Input id="title" value="Test annons" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="hourly-price" class="text-right">Timpris</Label>
            <Input
              id="hourly-price"
              type="number"
              value="100"
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
