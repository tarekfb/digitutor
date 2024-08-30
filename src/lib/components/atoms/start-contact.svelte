<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import * as Form from "$lib/components/ui/form";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "../ui/textarea";
  import { isStartingContact } from "src/stores/start-contact";

  export let form;
  export let action: string;

  const isDesktop = mediaQuery("(min-width: 768px)");
  const { form: formData, enhance, delayed, allErrors, message } = form;
  const description =
    "För att få snabba och tydliga svar från läraren kan det vara bra att nämna följande punkter:";
  const suggestions = [
    "Online eller fysiskt?",
    "Vilket språk eller teknologi du vill ha hjälp med?",
    "Hur mycket erfarenhet har du redan?",
    "För vilket ändamål (tenta, hobby, inlämning, o.s.v.)",
  ];
  const title = "Kontakta läraren";
  let dialogOpen = false;

  // sync store both ways
  $: dialogOpen, isStartingContact.set(dialogOpen);
  isStartingContact.subscribe((value) => {
    dialogOpen = value;
  });
</script>

{#if $isDesktop}
  <Dialog.Root bind:open={dialogOpen}>
    <Dialog.Trigger />
    <Dialog.Content class="sm:max-w-[425px] bg-card">
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
          {description}
          <ul class="list-disc list-inside px-4">
            {#each suggestions as suggestion}
              <li>{suggestion}</li>
            {/each}
          </ul>
        </Dialog.Description>
      </Dialog.Header>
      <form method="POST" {action} use:enhance class="flex flex-col gap-y-4">
        <input type="hidden" name="teacher" value={$formData.teacher} />
        <input type="hidden" name="role" value={$formData.role} />
        <Form.Field {form} name="firstMessage">
          <Form.Control let:attrs>
            <Label>Ditt meddelande</Label>
            <Textarea
              {...attrs}
              placeholder="Skriv ett meddelande till läraren..."
              class="resize-y"
              bind:value={$formData.firstMessage}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <FormMessage {message} scroll />
        <div class="flex justify-end gap-x-4">
          <Dialog.Footer>
            <Dialog.Close asChild let:builder>
              <Button variant="outline" builders={[builder]}>Avbryt</Button>
            </Dialog.Close>
          </Dialog.Footer>
          <FormSubmit
            {delayed}
            {allErrors}
            text="Skicka"
            loadingText="Skickar..."
          />
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open={dialogOpen}>
    <Dialog.Trigger />
    <Drawer.Content class="bg-card">
      <Drawer.Header class="text-left">
        <Drawer.Title>{title}</Drawer.Title>
        <Drawer.Description>
          {description}
          <ul class="list-disc list-inside px-4">
            {#each suggestions as suggestion}
              <li>{suggestion}</li>
            {/each}
          </ul>
        </Drawer.Description>
      </Drawer.Header>
      <div class="flex flex-col gap-y-4 mx-4 mb-4">
        <form method="POST" {action} use:enhance class="flex flex-col gap-y-4">
          <input type="hidden" name="teacher" value={$formData.teacher} />
          <input type="hidden" name="role" value={$formData.role} />
          <Form.Field {form} name="firstMessage">
            <Form.Control let:attrs>
              <Label>Ditt meddelande</Label>
              <Textarea
                {...attrs}
                placeholder="Skriv ett meddelande till läraren..."
                class="resize-y"
                bind:value={$formData.firstMessage}
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <FormMessage {message} scroll />
          <div class="flex justify-end gap-x-2">
            <Drawer.Footer class="m-0 p-0">
              <Drawer.Close asChild let:builder>
                <Button variant="outline" builders={[builder]}>Avbryt</Button>
              </Drawer.Close>
            </Drawer.Footer>
            <FormSubmit
              {delayed}
              {allErrors}
              text="Skicka"
              loadingText="Skickar..."
            />
          </div>
        </form>
      </div>
    </Drawer.Content>
  </Drawer.Root>
{/if}
