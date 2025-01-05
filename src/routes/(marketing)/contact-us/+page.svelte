<script lang="ts">
  import { contactUsSchema } from "$lib/shared/models/contact-us.js";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import * as Form from "$lib/components/ui/form";
  import Label from "$lib/components/atoms/label.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import type { PageData } from "./$types";
  import { SendHorizontal } from "lucide-svelte";

  export let data: PageData;

  const contactForm = superForm(data.form, {
    validators: zodClient(contactUsSchema),
    onUpdated({ form }) {
      if (form.valid)
        toast.success(`Meddelande skickat. Vi svarar så fort vi kan.`);
    },
  });

  const { form: formData, enhance, delayed, message, allErrors } = contactForm;
</script>

<RootContainer responsiveGap>
  <div class="flex flex-col items-center justify-center gap-y-0.5">
    <PrimaryTitle class="mb-2">Kontakta oss</PrimaryTitle>
    <p class="text-lg md:text-xl">
      Glöm inte att kika om din fråga finns bland <Link
        class="text-lg"
        href="/#faq">vanliga frågor och svar</Link
      >.
    </p>
  </div>
  <p class="self-start text-muted-foreground md:text-lg">
    Vi svarar dig så fort vi kan.
  </p>

  <FormMessage {message} scroll />
  <form
    class="mt-4 flex w-full max-w-xl flex-col gap-y-2 text-lg md:gap-y-4 md:text-xl"
    method="POST"
    action="?/submit"
    use:enhance
  >
    <Form.Field form={contactForm} name="email">
      <Form.Control let:attrs>
        <Label>E-postadress</Label>
        <Input
          class="bg-card"
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
          class="bg-card"
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
          class="bg-card"
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
          class="resize-y bg-card"
          bind:value={$formData.message}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <FormSubmit
      {delayed}
      {allErrors}
      text="Skicka"
      class="self-center md:min-w-wider"
    >
      <SendHorizontal slot="icon" class="h-5 w-5" />
    </FormSubmit>
  </form>
</RootContainer>
