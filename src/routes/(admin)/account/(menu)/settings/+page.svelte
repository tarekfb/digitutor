<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import SettingsForm from "$lib/components/molecules/settings-form.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import { toast } from "svelte-sonner";
  import {
    deleteAccountSchema as deleteSchema,
    passwordSchema,
  } from "$lib/shared/models/user.js";
  import {
    emailSchema,
    nameSchema,
  } from "$lib/shared/models/profile";
  import DeleteAccount from "$lib/components/atoms/delete-account.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";

  import AvatarForm from "src/lib/components/molecules/avatar-form.svelte";
  import type { PageData } from "./$types";

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("settings");

  export let data: PageData;

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
  const emailForm = superForm(data.updateEmailForm, {
    validators: zodClient(emailSchema),
  });
  const deleteForm = superForm(data.deleteAccountForm, {
    validators: zodClient(deleteSchema),
  });
  const passwordForm = superForm(data.updatePasswordForm, {
    validators: zodClient(passwordSchema),
  });

  const { form: nameData, reset: nameReset } = nameForm;
  const { form: emailData } = emailForm;
  const { form: passwordData } = passwordForm;
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex flex-col gap-y-4 pb-8 w-[275px] md:w-[600px] md:max-w-xl">
  <PrimaryTitle class="text-center">Inställningar</PrimaryTitle>
  <SettingsForm form={nameForm} action="?/name" title="Namn" submitText="Ändra">
    <Form.Field form={nameForm} name="firstName">
      <Form.Control let:attrs>
        <Form.Label>Förnamn</Form.Label>
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
        <Form.Label>Efternamn</Form.Label>
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

  <SettingsForm
    form={emailForm}
    action="?/email"
    title="E-postadress"
    submitText="Ändra"
  >
    <p class="text-muted-foreground">
      Du kommer behöva bekräfta den nya och den gamla adressen.
    </p>
    <Form.Field form={emailForm} name="email">
      <Form.Control let:attrs>
        <Label>E-postadress</Label>
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

  <AvatarForm
    uploadAvatarForm={data.uploadAvatarForm}
    deleteAvatarForm={data.deleteAvatarForm}
    avatarUrl={data.profile.avatar_url}
  />

  <SettingsForm
    form={passwordForm}
    action="?/password"
    title="Lösenord"
    submitText="Ändra"
  >
    <Form.Field form={passwordForm} name="new">
      <Form.Control let:attrs>
        <Label>Nytt lösenord</Label>
        <PasswordInput formData={passwordData} {attrs} placeholder="" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={passwordForm} name="confirm">
      <Form.Control let:attrs>
        <Label>Bekräfta nytt lösenord</Label>
        <PasswordInput formData={passwordData} {attrs} placeholder="" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={passwordForm} name="current">
      <Form.Control let:attrs>
        <Label>Nuvarande lösenord</Label>
        <PasswordInput formData={passwordData} {attrs} placeholder="" />
      </Form.Control>
      <Form.Description />
      <Form.FieldErrors />
    </Form.Field>
  </SettingsForm>

  <DeleteAccount form={deleteForm} />
</div>
