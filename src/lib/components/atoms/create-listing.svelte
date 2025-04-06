<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import SecondaryTitle from "./secondary-title.svelte";
  import LoadingSpinner from "./loading-spinner.svelte";
  import { Input } from "$lib/components/ui/input/index.ts";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let open = false;
  export let form;
  const { form: formData, enhance, delayed, allErrors, message } = form;
</script>

<div class="flex flex-col gap-y-4 generic-card text-center w-full">
  <SecondaryTitle>Skapa ny annons</SecondaryTitle>
  <FormMessage {message} scroll />
  <Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        disabled={$delayed}
        aria-label="Skapa annons"
        class="md:self-center wide-button"
      >
        {#if $delayed}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          Skapa
        {/if}
      </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px] bg-card">
      <Dialog.Header>
        <Dialog.Title>Skapa annons</Dialog.Title>
        <Dialog.Description>
          Du kan fylla i mer information om annonsen, eller ändra rubriken, i
          nästa steg.
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
              placeholder="Skriv en rubrik..."
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="nbrOfListings" hidden>
          <Form.Control let:attrs>
            <Input
              {...attrs}
              type="hidden"
              bind:value={$formData.nbrOfListings}
              placeholder="Rubrik"
            />
          </Form.Control>
        </Form.Field>
        <div class="flex justify-end gap-x-4">
          <Dialog.Footer>
            <Dialog.Close asChild let:builder>
              <Button variant="outline" builders={[builder]}>Avbryt</Button>
            </Dialog.Close>
          </Dialog.Footer>
          <FormSubmit {delayed} {allErrors} text="Skapa" />
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>
