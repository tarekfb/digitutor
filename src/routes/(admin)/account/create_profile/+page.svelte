<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { completeProfileSchema } from "src/lib/models/user";
  import { Input } from "src/lib/components/ui/input";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import { goto } from "$app/navigation";
  import { LogOut } from "lucide-svelte";
  import { websiteName } from "src/lib/constants";
  export let data;
  let { session, form } = data;

  const completeProfileForm = superForm(form, {
    validators: zodClient(completeProfileSchema),
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
  const { form: formData, enhance, errors, submitting } = completeProfileForm;
</script>

<svelte:head>
  <title>Skapa profil</title>
</svelte:head>
<div
  class="text-center max-w-lg py-12 flex flex-col items-center justify-center gap-y-4"
>
  <form
    class="flex text-start mx-auto max-w-sm md:max-w-xl"
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
        <Button
          type="submit"
          disabled={($errors._errors && $errors._errors.length > 0) ||
            $submitting}
        >
          {#if $submitting}
            <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
          {:else}
            Skapa profil
          {/if}
        </Button>
      </Card.Footer>
    </Card.Root>
  </form>
  <div class="text-sm text-muted-foreground">
    You are logged in as {session?.user?.email}.
    <Button variant="secondary" on:click={() => goto("/account/sign_out")}>
      <LogOut class="mr-2 h-4 w-4" />
      Logga ut
    </Button>
  </div>
</div>
