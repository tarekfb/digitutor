<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import SettingsForm from "src/lib/components/molecules/settings-form.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { emailSchema, nameSchema } from "src/lib/models/profile.js";
  import { Input } from "src/lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import { toast } from "svelte-sonner";
  import { deleteAccountSchema } from "src/lib/models/user.js";
  import DeleteAccount from "src/lib/components/atoms/delete-account.svelte";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("settings");

  export let data;
  const nameForm = superForm(data.updateNameForm, {
    validators: zodClient(nameSchema),
    onUpdated({ form }) {
      if (form.valid) {
        nameReset({ newState: data.updateNameForm.data });
        toast.success(`Ändrat namn.`);
      }
    },
    resetForm: false,
  });
  const { form: nameData, reset: nameReset } = nameForm;

  const emailForm = superForm(data.updateEmailForm, {
    validators: zodClient(emailSchema),
  });
  const { form: emailData } = emailForm;

  const deleteForm = superForm(data.deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
  });
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex flex-col gap-y-4 pb-8">
  <PrimaryTitle>Inställningar</PrimaryTitle>
  <SettingsForm form={nameForm} action="?/name" title="Namn">
    <Form.Field form={nameForm} name="firstName">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          type="text"
          bind:value={$nameData.firstName}
          placeholder="Förnamn"
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={nameForm} name="lastName">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          type="text"
          bind:value={$nameData.lastName}
          placeholder="Efternamn"
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </SettingsForm>

  <SettingsForm form={emailForm} action="?/email" title="Email">
    <Form.Field form={emailForm} name="email">
      <Form.Control let:attrs>
        <Input
          {...attrs}
          type="email"
          bind:value={$emailData.email}
          placeholder="Email"
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </SettingsForm>

  <DeleteAccount form={deleteForm} />
</div>
