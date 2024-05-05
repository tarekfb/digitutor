<script lang="ts">
  import { Trash2 } from "lucide-svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { enhance } from "$app/forms";
  import LoadingSpinner from "$lib/components/loading-spinner.svelte";
  import { Button } from "$lib/components/ui/button";
  
  let formLoading = false;
  let isOpen = false;
</script>

<AlertDialog.Root bind:open={isOpen}>
  <AlertDialog.Trigger asChild let:builder>
    <Button builders={[builder]} variant="destructive" size="icon" aria-label="Delete listing">
      <Trash2 />
    </Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Är du säker?</AlertDialog.Title>
      <AlertDialog.Description>
        Detta går inte att ångra. Tar du bort annonsen försvinner den helt och
        hållet.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Avbryt</AlertDialog.Cancel>
      <form
        method="POST"
        action="?/deleteListing"
        use:enhance={() => {
          formLoading = true;
          return async ({ update }) => {
            formLoading = false;
            isOpen = false;
            update();
          };
        }}
      >
        {#if formLoading}
          <Button disabled type="submit" class="w-full space-x-2">
            <LoadingSpinner size={{ w: 5, h: 5 }} /><span>Laddar...</span
            ></Button
          >
        {:else}
          <Button type="submit" variant="destructive" class="w-full space-x-2">
            <Trash2 /><span>Ta bort</span></Button
          >
        {/if}
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
