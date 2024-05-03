<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import { IconCurrencyKroneSwedish } from "@tabler/icons-svelte";
  import { IconHeading } from "@tabler/icons-svelte";
  // import * as Dialog from "$lib/components/ui/dialog";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");
  let isModalOpen = true;

  const createNewListing = async () => {};
</script>

<svelte:head>
  <title>Account</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-1">Dashboard</h1>

<div class="my-6">
  <h1 class="text-xl font-bold mb-1">Annonser</h1>
  <p>Här ska annonserna in</p>
  <button class="btn" on:click={() => (isModalOpen = true)}>Skapa annons</button
  >
  <dialog
    id="new-listing"
    class="modal modal-bottom sm:modal-middle"
    class:modal-open={isModalOpen}
  >
    <div class="modal-box">
      <h2 class="font-bold text-lg">Skapa annons</h2>
      <form class="py-4 flex flex-col gap-y-4">
        <label class="input input-bordered flex items-center gap-2">
          <IconHeading />
          <input type="text" class="grow" placeholder="Rubrik" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <IconCurrencyKroneSwedish />
          <input type="number" class="grow" placeholder="Timpris" />
        </label>
        <button class="btn btn-primary">Skapa</button>
      </form>
      <div class="modal-action">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            on:click={() => (isModalOpen = false)}>✕</button
          >
        </form>
      </div>
    </div>
  </dialog>

  <!-- <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
        <Dialog.Description>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root> -->
</div>
