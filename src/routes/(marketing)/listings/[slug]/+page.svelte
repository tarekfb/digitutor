<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { Trash2 } from "lucide-svelte";
  import { Construction } from "lucide-svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";

  export let data;
  const listing = data.listing;
</script>

<div class="p-8 space-y-2">
  {#if !listing}
    <h1 class="text-3xl">Ojdå... Här var det tomt</h1>
    <h1 class="text-xl">
      Den här annonsen finns inte längre. Vill du gå hem istället?
    </h1>

    <Button on:click={() => goto("/")}>Gå hem</Button>
  {:else}
    <div class="flex justify-between items-center">
      <h1 class="text-3xl">{listing.title}</h1>
      <form method="POST" action="?/deleteListing">
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild let:builder>
            <Button builders={[builder]} aria-label="Delete listing">
              <Trash2 />
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Är du säker?</AlertDialog.Title>
              <AlertDialog.Description>
                Detta går inte att ångra. Tar du bort annonsen försvinner den
                helt och hållet.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Avbryt</AlertDialog.Cancel>
              <AlertDialog.Action on:click={() => goto("/")}
                >Ta bort</AlertDialog.Action
              >
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </form>
    </div>
    <h2 class="text-xl">{listing.hourlyPrice} SEK</h2>
    <div class="flex flex-col items-center gap-y-4 mt-12">
      <Construction size="100" />
      <h3 class="text-4xl">Work in progress</h3>
    </div>
  {/if}
</div>
