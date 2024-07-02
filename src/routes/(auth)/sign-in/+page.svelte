<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signInSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";

  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import { MessageId } from "$lib/shared/constants/constants";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import { mediaQuery } from "svelte-legos";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";

  export let data;

  const isDesktop = mediaQuery("(min-width: 768px)");
  const userForm = superForm(data.form, {
    validators: zodClient(signInSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
    resetForm: false,
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<div class="flex flex-col justify-center gap-y-4 m-8">
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
            href="/sign-up"
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
          href="/forgot-password"
          class="underline text-muted-foreground text-sm justify-self-center"
          >Glömt lösen?</a
        >
      </Card.Content>
      <Card.Footer class="flex flex-col justify-center">
        <FormSubmit
          {submitting}
          {allErrors}
          text="Skapa konto"
          class="self-center"
        />
      </Card.Footer>
    </Card.Root>
  </form>
</div>
