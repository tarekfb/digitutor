<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types.ts";
  import { superForm } from "sveltekit-superforms";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { passwordResetSchema } from "src/lib/shared/models/user.ts";
  import Container from "src/lib/components/templates/container.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import Label from "$lib/components/atoms/label.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.ts";

  export let data: PageData;

  const passwordResetForm = superForm(data.form, {
    validators: zodClient(passwordResetSchema),
  });
  const { form, enhance, delayed, message, allErrors } = passwordResetForm;
</script>

<svelte:head>
  <title>{websiteName} | Uppdatera lösenord</title>
</svelte:head>

<Container responsiveGap maxWidth minWidth class="self-center">
  <div class="flex flex-col items-center justify-center gap-y-0.5">
    <PrimaryTitle class="mb-2">Uppdatera lösenord</PrimaryTitle>
    <p class="text-lg text-muted-foreground md:text-xl">
      Ange ett nytt lösenord.
    </p>
  </div>

  <form
    class="mt-4 flex w-full max-w-xl flex-col gap-y-4 text-lg md:text-xl"
    method="POST"
    action="?/reset"
    use:enhance
  >
    <Form.Field form={passwordResetForm} name="newPassword">
      <Form.Control let:attrs>
        <Label>Nytt lösenord</Label>
        <PasswordInput formData={form} {attrs} bgStyling="bg-card" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <FormMessage {message} scroll />
    <FormSubmit
      {delayed}
      {allErrors}
      text="Uppdatera"
      class="self-center md:min-w-wider"
    />
  </form>
</Container>
