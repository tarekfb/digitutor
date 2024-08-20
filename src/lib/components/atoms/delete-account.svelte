<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import SecondaryTitle from "./secondary-title.svelte";
  import LoadingSpinner from "./loading-spinner.svelte";
  import * as Form from "$lib/components/ui/form";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import PasswordInput from "../molecules/password-input.svelte";

  let open = false;
  const isDesktop = mediaQuery("(min-width: 768px)");
  export let form;
  const { form: formData, enhance, delayed, allErrors, message } = form;
  const description =
    "Detta går inte att ångra. Tar du bort ditt konto försvinner kontot och all relaterad information permanent.";
  const title = "Är du säker?";
</script>

<div class="flex flex-col gap-y-4 generic-card">
  <SecondaryTitle>Ta bort konto</SecondaryTitle>
  <FormMessage {message} scroll />
  {#if $isDesktop}
    <Dialog.Root bind:open>
      <Dialog.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="destructive"
          disabled={$delayed}
          aria-label="Delete account"
          class="md:self-center md:min-w-wider"
        >
          {#if $delayed}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Ta bort
          {/if}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content class="sm:max-w-[425px] bg-card">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>
            {description}
          </Dialog.Description>
        </Dialog.Header>
        <FormMessage {message} scroll />
        <form
          method="POST"
          action="?/delete"
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
  {:else}
    <Drawer.Root bind:open>
      <Drawer.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="destructive"
          disabled={$delayed}
          aria-label="Delete account"
          class="md:self-center md:min-w-wider"
        >
          {#if $delayed}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Ta bort
          {/if}
        </Button>
      </Drawer.Trigger>
      <Drawer.Content class="bg-card">
        <Drawer.Header class="text-left">
          <Drawer.Title>{title}</Drawer.Title>
          <Drawer.Description>
            {description}
          </Drawer.Description>
        </Drawer.Header>
        <div class="flex flex-col gap-y-4 mx-4 mb-4">
          <FormMessage {message} scroll />
          <form
            method="POST"
            action="?/delete"
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
            <div class="flex justify-end gap-x-2">
              <Drawer.Footer class="m-0 p-0">
                <Drawer.Close asChild let:builder>
                  <Button variant="outline" builders={[builder]}>Avbryt</Button>
                </Drawer.Close>
              </Drawer.Footer>
              <FormSubmit
                {delayed}
                {allErrors}
                text="Ta bort"
                variant="destructive"
              />
            </div>
          </form>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  {/if}
</div>
