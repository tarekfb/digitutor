<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { signInSchema } from "src/lib/models/user";
  import { Input } from "src/lib/components/ui/input";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  export let data;
  let { supabase, form } = data;

  onMount(() => {
    supabase.auth.onAuthStateChange((event) => {
      // Redirect to account after sucessful login
      if (event == "SIGNED_IN") {
        // Delay needed because order of callback not guaranteed.
        // Give the layout callback priority to update state or
        // we'll just bounch back to login when /account tries to load
        setTimeout(() => {
          goto("/account");
        }, 1);
      }
    });
  });

  const userForm = superForm(form, {
    validators: zodClient(signInSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, errors, submitting, message } = userForm;
</script>

<svelte:head>
  <title>Logga in</title>
</svelte:head>

<form class="text-start" method="POST" use:enhance>
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
      <a
        href="/login/forgot_password"
        class="underline text-muted-foreground text-sm justify-self-center"
        >Glömt lösen?</a
      >
    </Card.Content>
    <Card.Footer class="flex flex-col justify-center">
      <Button
        type="submit"
        disabled={($errors._errors && $errors._errors.length > 0) ||
          $submitting}
      >
        {#if $submitting}
          <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
        {:else}
          Logga in
        {/if}
      </Button>
    </Card.Footer>
  </Card.Root>
</form>

{#if $page.url.searchParams.get("verified") == "true"}
  <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      /></svg
    > -->

  <Alert.Root variant="success" class="bg-card">
    <Alert.Title>E-post verifierad</Alert.Title>
    <Alert.Description>Vänligen logga in.</Alert.Description>
  </Alert.Root>
{/if}
{#if $message}
  <Alert.Root variant={$message.variant ?? "default"} class="bg-card">
    <Alert.Title>{$message.title}</Alert.Title>
    <Alert.Description>
      {$message.description}
    </Alert.Description>
  </Alert.Root>
{/if}

<!-- <<Auth
  supabaseClient={data.supabase}
  view="sign_in"
  redirectTo={`${data.url}/auth/callback`}
  providers={oauthProviders}
  socialLayout="horizontal"
  showLinks={false}
  appearance={sharedAppearance}
  additionalData={undefined}
/>> -->
<!-- <div>
  <Button
    variant="link"
    class="underline text-md"
    on:click={() => goto("/login/forgot_password")}
  >
    Glömt lösenord
  </Button>
  <div class="flex gap-x-1 items-center">
    Har du inget konto?
    <Button
      variant="link"
      class="underline text-md m-0 p-1"
      on:click={() => goto("/login/sign_up")}
    >
      Skapa konto
    </Button>
  </div>
</div> -->
