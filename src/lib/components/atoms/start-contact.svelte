<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { isStartingContact } from "src/stores/start-contact.ts";
  import { costPerRequest } from "src/lib/shared/constants/constants.js";
  import Link from "./link.svelte";
  import CharCount from "./char-count.svelte";
  import {
    maxMessageLength,
    startContactSchema,
  } from "src/lib/shared/models/conversation.ts";
  import type { Infer, SuperForm } from "sveltekit-superforms";

  export let form: SuperForm<Infer<typeof startContactSchema>>;
  export let action: string;

  const { form: formData, enhance, delayed, allErrors, message, errors } = form;

  const suggestions = [
    "Online eller fysiskt?",
    "Vilket språk eller teknologi du vill ha hjälp med?",
    "Hur mycket erfarenhet har du redan?",
    "För vilket ändamål (tenta, hobby, inlämning, o.s.v.)",
  ];
  let dialogOpen = false;

  // sync store both ways
  $: dialogOpen, isStartingContact.set(dialogOpen);
  isStartingContact.subscribe((value) => {
    dialogOpen = value;
  });
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger />
  <Dialog.Content class="bg-card sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Kontakta läraren</Dialog.Title>
      <Dialog.Description class="text-start">
        <p>
          För att få snabba och tydliga svar från läraren kan det vara bra att
          nämna följande punkter:
        </p>
        <ul class="list-inside list-disc px-4 text-start">
          {#each suggestions as suggestion}
            <li class="mt-1">{suggestion}</li>
          {/each}
        </ul>
        <p class="mt-4">
          Detta förbrukar {costPerRequest} gratis kontaktförfrågan. För dig som har
          <Link href="/pricing">premium</Link> har du oändligt med kontaktförfrågningar.
        </p>
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" {action} use:enhance class="flex flex-col gap-y-4">
      <input type="hidden" name="teacher" value={$formData.teacher} />
      <input type="hidden" name="role" value={$formData.role} />
      <Form.Field {form} name="firstMessage" class="flex flex-col gap-x-2">
        <Form.Control let:attrs>
          <Label>Ditt meddelande</Label>
          <Textarea
            {...attrs}
            placeholder="Skriv ett meddelande till läraren..."
            class="resize-y"
            bind:value={$formData.firstMessage}
          />
        </Form.Control>
        <CharCount
          text={$formData.firstMessage}
          errors={$errors.firstMessage}
          max={maxMessageLength}
        />
        <Form.FieldErrors />
      </Form.Field>
      <FormMessage {message} scroll />
      <div class="flex justify-end gap-x-4">
        <Dialog.Footer>
          <Dialog.Close asChild let:builder>
            <Button variant="outline" builders={[builder]}>Avbryt</Button>
          </Dialog.Close>
        </Dialog.Footer>
        <FormSubmit {delayed} {allErrors} text="Skicka" />
      </div>
    </form>
  </Dialog.Content>
</Dialog.Root>
