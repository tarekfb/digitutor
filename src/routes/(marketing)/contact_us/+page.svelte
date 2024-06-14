<script lang="ts">
  import { applyAction } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { contactUsSchema } from "src/lib/models/contact-us.js";
  import { sendMessageSchema } from "src/lib/models/conversations.js";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import * as Form from "$lib/components/ui/form";
  import Label from "src/lib/components/atoms/label.svelte";
  import { Input } from "src/lib/components/ui/input";
  import { Textarea } from "src/lib/components/ui/textarea";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SecondaryTitle from "src/lib/components/atoms/secondary-title.svelte";
  import Link from "src/lib/components/atoms/link.svelte";

  export let data;

  const contactForm = superForm(data.form, {
    validators: zodClient(contactUsSchema),
    onUpdated({ form }) {
      if (form.valid)
        toast.success(`Neddelande skickat. Vi svarar så fort vi kan.`);
    },
  });

  const {
    form: formData,
    enhance,
    submitting,
    message,
    allErrors,
  } = contactForm;
</script>

<div class="flex flex-col justify-center items-center gap-y-0.5">
  <PrimaryTitle class="mb-2">Kontakta oss</PrimaryTitle>
  <SecondaryTitle
    >Glöm inte att kika om din fråga finns i vår <Link
      class="text-lg"
      href="/faq">FAQ</Link
    >.
  </SecondaryTitle>
</div>
<div class="flex flex-col gap-y-1 text-muted-foreground">
  <p>Kontakta oss om du har något på hjärtat, t.ex. om:</p>
  <ul class="list-disc list-outside space-y-0.5 mx-6">
    <li>
      Din fråga inte täcks av vår <Link class="text-lg" href="/faq">FAQ</Link>.
    </li>
    <li>Du har synpunkter, klagomål eller önskningar.</li>
    <li>Du bara vill säga hej!</li>
  </ul>
  <p>Vi kontaktar dig så fort vi kan.</p>
</div>

<FormMessage {message} scroll />
<form
  class="flex flex-col gap-y-4 generic-card w-full max-w-xl"
  method="POST"
  action="?/submit"
  use:enhance
>
  <Form.Field form={contactForm} name="email">
    <Form.Control let:attrs>
      <Label>E-postadress</Label>
      <Input
        {...attrs}
        type="email"
        bind:value={$formData.email}
        placeholder="E-postadress"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field form={contactForm} name="firstName">
    <Form.Control let:attrs>
      <Label>Förnamn</Label>
      <Input
        {...attrs}
        type="text"
        bind:value={$formData.firstName}
        placeholder="Förnamn"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field form={contactForm} name="lastName">
    <Form.Control let:attrs>
      <Label>Efternamn</Label>
      <Input
        {...attrs}
        type="text"
        bind:value={$formData.lastName}
        placeholder="Efternamn"
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field form={contactForm} name="message">
    <Form.Control let:attrs>
      <Label>Ditt meddelande</Label>
      <Textarea
        {...attrs}
        placeholder="Skriv ett meddelande till oss..."
        class="resize-y"
        bind:value={$formData.message}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <FormSubmit {submitting} {allErrors} text="Skicka" loadingText="Skickar..." />
</form>
