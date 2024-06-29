<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { signUpSchema } from "$lib/shared/models/user.js";
  import { Input } from "$lib/components/ui/input";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import { mediaQuery } from "svelte-legos";

  export let data;

  const isDesktop = mediaQuery("(min-width: 768px)");
  const userForm = superForm(data.form, {
    validators: zodClient(signUpSchema),
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;
</script>

<svelte:head>
  <title>Skapa konto</title>
</svelte:head>

{#if $isDesktop}
  <div class="flex justify-between w-screen">
    <div class="w-full border border-solid border-red-500">
      <p>test</p>
    </div>
    <div class="w-full border border-solid border-red-500">
      <FormMessage {message} scroll scrollTo="end" />
      <form class="text-start" method="POST" use:enhance>
        <Card.Root>
          <Card.Header class="space-y-1">
            <Card.Title class="text-2xl">Skapa ett konto</Card.Title>
            <Card.Description
              >Har du redan ett konto? <a href="/sign-in" class="underline"
                >Logga in här.</a
              ></Card.Description
            >
          </Card.Header>
          <Card.Content class="grid gap-4">
            <Form.Field form={userForm} name="first_name">
              <Form.Control let:attrs>
                <Label>Förnamn</Label>
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
                <Label>Efternamn</Label>
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
                    Du accepterar <a href="/terms" class="underline"
                      >villkoren</a
                    >
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
              disabled={$allErrors.length > 0 || $submitting}
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
    </div>
  </div>
{:else}
  <FormMessage {message} scroll scrollTo="end" />
  <form class="text-start" method="POST" use:enhance>
    <Card.Root>
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl">Skapa ett konto</Card.Title>
        <Card.Description
          >Har du redan ett konto? <a href="/sign-in" class="underline"
            >Logga in här.</a
          ></Card.Description
        >
      </Card.Header>
      <Card.Content class="grid gap-4">
        <Form.Field form={userForm} name="first_name">
          <Form.Control let:attrs>
            <Label>Förnamn</Label>
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
            <Label>Efternamn</Label>
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
        <Button type="submit" disabled={$allErrors.length > 0 || $submitting}>
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
{/if}
