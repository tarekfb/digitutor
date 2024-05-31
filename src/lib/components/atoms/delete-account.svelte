<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import SecondaryTitle from "./secondary-title.svelte";
  import LoadingSpinner from "./loading-spinner.svelte";
  import { Input } from "src/lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";

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
        disabled={$submitting}
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
      <form method="POST" action="?/delete" use:enhance class="flex flex-col gap-y-4">
        <Form.Field {form} name="password">
          <Form.Control let:attrs>
            <Form.Label>Password</Form.Label>
            <Input {...attrs} type="password" bind:value={$formData.password} />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>
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
