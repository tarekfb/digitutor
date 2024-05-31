<script lang="ts">
  import { Trash2 } from "lucide-svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button";
  import FormSubmit from "../molecules/form-submit.svelte";
  import FormMessage from "../molecules/form-message.svelte";
  import SecondaryTitle from "./secondary-title.svelte";
  import { text } from "@sveltejs/kit";
  import LoadingSpinner from "./loading-spinner.svelte";

  let isOpen = false;
  export let form;

  const { form: formData, enhance, submitting, allErrors, message } = form;
</script>

<div class="flex flex-col gap-y-4 generic-card">
  <SecondaryTitle>Ta bort konto</SecondaryTitle>
  <AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="destructive"
        disabled={$allErrors.length > 0 || $submitting}
        aria-label="Delete account"
      >
        {#if $submitting}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          Ta bort konto
        {/if}
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Är du säker?</AlertDialog.Title>
        <AlertDialog.Description>
          Detta går inte att ångra. Tar du bort ditt konto försvinner kontot och
          all relaterad information permanent.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <form method="POST" action="?/delete" use:enhance>
        <input hidden value={$formData.id} name="id" />
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Avbryt</AlertDialog.Cancel>
          <AlertDialog.Action
            type="submit"
            disabled={$allErrors.length > 0 || $submitting}
            class="bg-destructive"
          >
            {#if $submitting}
              <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
            {:else}
              Ta bort konto
            {/if}
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </form>
    </AlertDialog.Content>
  </AlertDialog.Root>
  <FormMessage {message} scroll />
</div>
