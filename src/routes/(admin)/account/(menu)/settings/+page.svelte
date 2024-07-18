<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import SettingsForm from "$lib/components/molecules/settings-form.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { emailSchema, nameSchema } from "$lib/shared/models/profile.js";
  import { Input } from "$lib/components/ui/input";
  import * as Form from "$lib/components/ui/form";
  import { toast } from "svelte-sonner";
  import {
    deleteAccountSchema as deleteSchema,
    passwordSchema,
  } from "$lib/shared/models/user.js";
  import DeleteAccount from "$lib/components/atoms/delete-account.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import { maxAvatarSizeSelection } from "src/lib/shared/constants/constants.js";
  import { formatBytes } from "src/lib/utils.js";

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
  const emailForm = superForm(data.updateEmailForm, {
    validators: zodClient(emailSchema),
  });
  const deleteForm = superForm(data.deleteAccountForm, {
    validators: zodClient(deleteSchema),
  });
  const passwordForm = superForm(data.updatePasswordForm, {
    validators: zodClient(passwordSchema),
  });
  const avatarForm = superForm(data.uploadAvatarForm, {
    onUpdated({ form }) {
      if (form.valid) {
        toast.success(`Ändrat profilbild.`);
      }
    },
  });
  const { form: nameData, reset: nameReset } = nameForm;
  const { form: emailData } = emailForm;
  const { form: passwordData } = passwordForm;
  const { form: avatarData } = avatarForm;

  const setAvatar = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => {
    avatarForm.reset();
    $avatarData.avatar = e.currentTarget?.files?.item(0) as File;
  };
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex flex-col gap-y-4 pb-8 max-w-[300px] md:max-w-xl">
  <PrimaryTitle>Inställningar</PrimaryTitle>
  <SettingsForm
    form={nameForm}
    action="?/name"
    title="Namn"
    submitText="Ändra namn"
  >
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
    submitText="Ändra e-post"
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

  <SettingsForm
    form={avatarForm}
    action="?/avatar"
    title="Profilbild"
    submitText="Ändra profilbild"
    enctype="multipart/form-data"
  >
    <p class="text-muted-foreground">
      Maxstorlek är {formatBytes(maxAvatarSizeSelection)}. Bilden komprimeras
      automatiskt.
    </p>
    <Form.Field form={avatarForm} name="avatar">
      <Form.Control let:attrs>
        <Label>Profilbild</Label>
        <input
          {...attrs}
          type="file"
          name="avatar"
          bind:value={$avatarData.avatar}
          accept="image/jpeg, image/png, image/webp"
          class="overflow-hidden flex h-10 w-full border border-input rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          on:input={(e) => setAvatar(e)}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </SettingsForm>

  <SettingsForm
    form={passwordForm}
    action="?/password"
    title="Lösenord"
    submitText="Ändra lösenord"
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
