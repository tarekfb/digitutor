<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import SecondaryTitle from "./secondary-title.svelte";
  import LoadingSpinner from "./loading-spinner.svelte";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let open = false;
  const isDesktop = mediaQuery("(min-width: 768px)");
  export let form;
  const { form: formData, enhance, submitting, allErrors, message } = form;
  const description =
    "Du kan fylla i mer information om annonsen, eller ändra rubriken, i nästa steg.";
  const title = "Skapa annons";
</script>

<div class="flex flex-col gap-y-4 generic-card text-center">
  <SecondaryTitle>Skapa ny annons</SecondaryTitle>
  <FormMessage {message} scroll />
  {#if $isDesktop}
    <Dialog.Root bind:open>
      <Dialog.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          disabled={$submitting}
          aria-label="Skapa annons"
        >
          {#if $submitting}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Skapa
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
          action="?/createListing"
          use:enhance
          class="flex flex-col gap-y-4"
        >
          <Form.Field {form} name="title">
            <Form.Control let:attrs>
              <Label>Rubrik</Label>
              <Input
                {...attrs}
                type="text"
                bind:value={$formData.title}
                placeholder="Rubrik"
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <div class="flex justify-end gap-x-4">
            <Dialog.Footer>
              <Dialog.Close asChild let:builder>
                <Button variant="outline" builders={[builder]}>Avbryt</Button>
              </Dialog.Close>
            </Dialog.Footer>
            <FormSubmit
              {submitting}
              {allErrors}
              text="Skapa"
              loadingText="Skapar..."
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
          disabled={$submitting}
          aria-label="Skapa annons"
        >
          {#if $submitting}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Skapa
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
            action="?/createListing"
            use:enhance
            class="flex flex-col gap-y-4"
          >
            <Form.Field {form} name="title">
              <Form.Control let:attrs>
                <Label>Rubrik</Label>
                <Input
                  {...attrs}
                  type="text"
                  bind:value={$formData.title}
                  placeholder="Rubrik"
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <div class="flex justify-end gap-x-2">
              <Drawer.Footer class="m-0 p-0">
                <Drawer.Close asChild let:builder>
                  <Button variant="outline" builders={[builder]}>Avbryt</Button>
                </Drawer.Close>
              </Drawer.Footer>
              <FormSubmit
                {submitting}
                {allErrors}
                text="Skapa"
                loadingText="Skapar..."
              />
            </div>
          </form>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  {/if}
</div>
