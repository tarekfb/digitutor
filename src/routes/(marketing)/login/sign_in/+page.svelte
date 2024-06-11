<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signInSchema } from "src/lib/models/user";
  import { Input } from "src/lib/components/ui/input";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";

  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import Label from "src/lib/components/atoms/label.svelte";
  import { MessageId } from "src/lib/constants.js";
  import PasswordInput from "src/lib/components/molecules/password-input.svelte";

  export let data;

  const userForm = superForm(data.form, {
    validators: zodClient(signInSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
    resetForm: false,
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;

  let show = false;
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<FormMessage {message} scroll>
  {#if $message.id === MessageId.RateLimitExceeded}
    <p class="mt-2">
      Försökte skicka bekräftelsemail men misslyckades p.g.a. för många
      e-postutskick.
    </p>
    <p>Försök igen lite senare.</p>
  {/if}
</FormMessage>
<form class="text-start" method="POST" action="?/signIn" use:enhance>
  <Card.Root>
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl">Logga in</Card.Title>
      <Card.Description
        >Har du inget konto? <a
          href="/login/sign_up"
          class="underline text-foreground">Skapa konto här.</a
        ></Card.Description
      >
    </Card.Header>
    <Card.Content class="grid gap-4">
      <Form.Field form={userForm} name="email">
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
      <Form.Field form={userForm} name="password">
        <Form.Control let:attrs>
          <Label>Lösenord</Label>
          <PasswordInput {formData} {attrs} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <a
        href="/login/forgot_password"
        class="underline text-muted-foreground text-sm justify-self-center"
        >Glömt lösen?</a
      >
    </Card.Content>
    <Card.Footer class="flex flex-col justify-center">
      <Button type="submit" disabled={$allErrors.length > 0 || $submitting}>
        {#if $submitting}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          Logga in
        {/if}
      </Button>
    </Card.Footer>
  </Card.Root>
</form>
