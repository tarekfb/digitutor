<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import SecondaryTitle from "./secondary-title.svelte";
  import LoadingSpinner from "./loading-spinner.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import PasswordInput from "../molecules/password-input.svelte";

  let open = false;
  export let form;
  const { form: formData, enhance, delayed, allErrors, message } = form;
</script>

<div class="generic-card flex w-full flex-col gap-y-4">
  <SecondaryTitle>Ta bort konto</SecondaryTitle>
  <FormMessage {message} scroll />
  <Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="destructive"
        disabled={$delayed}
        aria-label="Delete account"
        class="wide-button md:self-center"
      >
        {#if $delayed}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          Ta bort
        {/if}
      </Button>
    </Dialog.Trigger>
    <Dialog.Content class="bg-card sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Är du säker?</Dialog.Title>
        <Dialog.Description>
          Detta går inte att ångra. Tar du bort ditt konto försvinner kontot och
          all relaterad information permanent.
        </Dialog.Description>
      </Dialog.Header>
      <FormMessage {message} scroll />
      <form
        method="POST"
        action="?/deleteAccount"
        use:enhance
        class="flex flex-col gap-y-4"
      >
        <Form.Field {form} name="password">
          <Form.Control let:attrs>
            <Label>Password</Label>
            <PasswordInput {formData} {attrs} />
            <Form.FieldErrors />
          </Form.Control>
        </Form.Field>
        <div class="flex justify-end gap-x-4">
          <Dialog.Footer>
            <Dialog.Close asChild let:builder>
              <Button variant="outline" builders={[builder]}>Avbryt</Button>
            </Dialog.Close>
          </Dialog.Footer>
          <FormSubmit
            {delayed}
            {allErrors}
            text="Ta bort"
            variant="destructive"
          />
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>
