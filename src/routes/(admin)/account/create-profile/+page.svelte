<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { nameSchema } from "$lib/shared/models/profile.js";
  import { Input } from "$lib/components/ui/input";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { websiteName } from "src/lib/shared/constants/constants";

  export let data;
  $: ({ form } = data);

  const completeProfileForm = superForm(form, {
    validators: zodClient(nameSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Skapat profil.`);
      } else {
        toast.error("Fixa felen i formuläret.");
      }
    },
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, delayed, allErrors } = completeProfileForm;
</script>

<svelte:head>
  <title>{websiteName} | Skapa profil</title>
</svelte:head>

<div
  class="flex max-w-lg flex-col items-center justify-center gap-y-4 py-12 text-center"
>
  <form
    class="mx-auto flex max-w-sm text-start md:max-w-xl"
    method="POST"
    use:enhance
  >
    <Card.Root>
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl">Skapa profil</Card.Title>
        <Card.Description
          >Färdigställ ditt konto för att börja använda {websiteName}.
        </Card.Description>
      </Card.Header>
      <Card.Content class="grid gap-4">
        <Form.Field form={completeProfileForm} name="firstName">
          <Form.Control let:attrs>
            <Input
              {...attrs}
              type="text"
              bind:value={$formData.firstName}
              placeholder="Förnamn"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field form={completeProfileForm} name="lastName">
          <Form.Control let:attrs>
            <Input
              {...attrs}
              type="text"
              bind:value={$formData.lastName}
              placeholder="Efternamn"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </Card.Content>
      <Card.Footer class="justify-center">
        <Button type="submit" disabled={$allErrors.length > 0 || $delayed}>
          {#if $delayed}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Skapa profil
          {/if}
        </Button>
      </Card.Footer>
    </Card.Root>
  </form>
  <!-- <div class="text-sm text-muted-foreground">
    You are logged in as {session?.user?.email}.
    <Button variant="secondary" on:click={() => goto("/account/sign_out")}>
      <LogOut class="mr-2 h-4 w-4" />
      Logga ut
    </Button>
  </div> -->
</div>
