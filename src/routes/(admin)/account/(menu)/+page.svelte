<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import * as Dialog from "$lib/components/ui/dialog";
  import ListingComponent from "$lib/components/listing.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import type { Listing } from "$lib/server/database/listings";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");

  export let data;
  const listings = data.listings as Listing[]; // will always be an array
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-1">Dina annonser</h1>

<div class="my-6">
  <div class="flex flex-col gap-y-4 mb-4">
    {#if listings.length === 0}
      <p>Inga annonser. Testa skapa en!</p>
    {:else}
    {#each listings as listing}
      <a href="/listings/{listing.id}" aria-label="Navigate to ad">
        <ListingComponent {listing} />
      </a>
    {/each}

    {/if}
  </div>
  
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
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="hourlyPrice" class="text-right">Timpris</Label>
            <Input
              id="hourlyPrice"
              name="hourlyPrice"
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
