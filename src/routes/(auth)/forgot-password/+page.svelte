<script lang="ts">
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { requestPasswordResetSchema } from "src/lib/shared/models/user";
  import RootContainer from "src/lib/components/templates/root-container.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import Label from "$lib/components/atoms/label.svelte";
  import { SendHorizontal } from "lucide-svelte";

  export let data: PageData;
  const requestResetForm = superForm(data.form, {
    validators: zodClient(requestPasswordResetSchema),
  });
  const {
    form: formData,
    enhance,
    delayed,
    message,
    allErrors,
  } = requestResetForm;
</script>

<svelte:head>
  <title>Glömt lösenord</title>
</svelte:head>

<RootContainer responsiveGap maxWidth >
  <div class="flex flex-col items-center justify-center gap-y-0.5">
    <PrimaryTitle class="mb-2">Glömt lösenord</PrimaryTitle>
    <p class="text-lg text-muted-foreground md:text-xl text-center">
      Ange e-postaddressen för ditt konto så skickar vi ett e-post med information om hur du återställer
      ditt lösenord.
    </p>
  </div>

  <FormMessage {message} scroll />
  <form
    class="mt-4 flex w-full max-w-xl flex-col gap-y-4 text-lg md:text-xl"
    method="POST"
    action="?/requestReset"
    use:enhance
  >
    <Form.Field form={requestResetForm} name="email">
      <Form.Control let:attrs>
        <Label hidden>E-postadress</Label>
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
