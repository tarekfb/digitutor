<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { signUpSchema } from "src/lib/models/user";
  import { Input } from "src/lib/components/ui/input";
  import { Checkbox } from "src/lib/components/ui/checkbox";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import * as Alert from "$lib/components/ui/alert/index.js";

  export let data;
  const { form } = data;
  const userForm = superForm(form, {
    validators: zodClient(signUpSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;
</script>

<svelte:head>
  <title>Skapa konto</title>
</svelte:head>

{#if $message}
  <div>
    <Alert.Root variant={$message.variant ?? "default"} class="bg-card">
      <Alert.Title>{$message.title}</Alert.Title>
      <Alert.Description>
        {$message.description}
      </Alert.Description>
    </Alert.Root>
  </div>
{/if}
<form class="text-start" method="POST" use:enhance>
  <Card.Root>
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl">Skapa ett konto</Card.Title>
      <Card.Description
        >Har du redan ett konto? <a href="/login/sign_in" class="underline"
          >Logga in här.</a
        ></Card.Description
      >
    </Card.Header>
    <Card.Content class="grid gap-4">
      <Form.Field form={userForm} name="first_name">
        <Form.Control let:attrs>
          <Input
            {...attrs}
            type="text"
            bind:value={$formData.first_name}
            placeholder="Förnamn"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={userForm} name="last_name">
        <Form.Control let:attrs>
          <Input
            {...attrs}
            type="text"
            bind:value={$formData.last_name}
            placeholder="Efternamn"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={userForm} name="email">
        <Form.Control let:attrs>
          <Input
            {...attrs}
            type="email"
            bind:value={$formData.email}
            placeholder="Email"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field form={userForm} name="password">
        <Form.Control let:attrs>
          <Input
            {...attrs}
            type="password"
            bind:value={$formData.password}
            placeholder="Lösenord"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Fieldset form={userForm} name="role" class="space-y-3">
        <Form.Legend>Jag vill registrera mig som...</Form.Legend>
        <RadioGroup.Root
          bind:value={$formData.role}
          class="flex flex-col space-y-1"
        >
          <div class="flex items-center space-x-3 space-y-0">
            <Form.Control let:attrs>
              <RadioGroup.Item value="student" {...attrs} />
              <Form.Label class="font-normal">Student</Form.Label>
            </Form.Control>
          </div>
          <div class="flex items-center space-x-3 space-y-0">
            <Form.Control let:attrs>
              <RadioGroup.Item value="teacher" {...attrs} />
              <Form.Label class="font-normal">Lärare</Form.Label>
            </Form.Control>
          </div>
          <RadioGroup.Input name="role" />
        </RadioGroup.Root>
        <Form.FieldErrors />
      </Form.Fieldset>
      <Form.Field
        form={userForm}
        name="terms"
        class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
      >
        <Form.Control let:attrs>
          <Checkbox {...attrs} bind:checked={$formData.terms} />
          <div class="space-y-1 leading-none">
            <Form.Label class="text-foreground"
              >Jag accepterar villkoren och integritetspolicyn.</Form.Label
            >
            <Form.Description>
              Du accepterar <a href="/terms" class="underline">villkoren</a>
              och
              <a href="/privacy" class="underline">integritetspolicyn</a>.
            </Form.Description>
          </div>
          <input name={attrs.name} value={$formData.terms} hidden />
        </Form.Control>
      </Form.Field>
    </Card.Content>
    <Card.Footer class="justify-center">
      <Button
        type="submit"
        disabled={$allErrors.length > 0 ||
          $submitting}
      >
        {#if $submitting}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          Skapa konto
        {/if}
      </Button>
    </Card.Footer>
  </Card.Root>
  <!-- <Loader2 class="mr-2 h-4 w-4 animate-spin" /> -->
</form>
