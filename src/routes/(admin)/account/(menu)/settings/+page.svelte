<script lang="ts">
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Label from "$lib/components/atoms/label.svelte";
  import SettingsForm from "$lib/components/molecules/settings-form.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import { toast } from "svelte-sonner";
  import {
    deleteAccountSchema as deleteSchema,
    changePasswordSchema,
  } from "$lib/shared/models/user.js";
  import {
    emailSchema,
    nameSchema,
    updateBioSchema,
  } from "$lib/shared/models/profile.ts";
  import DeleteAccount from "$lib/components/atoms/delete-account.svelte";
  import PasswordInput from "$lib/components/molecules/password-input.svelte";
  import AvatarForm from "src/lib/components/molecules/avatar-form.svelte";
  import type { PageData } from "./$types.ts";
  import Container from "src/lib/components/templates/container.svelte";
  import AccountLayout from "src/lib/components/templates/account-layout.svelte";
  import { Textarea } from "src/lib/components/ui/textarea/index.ts";
  import * as Collapsible from "$lib/components/ui/collapsible/index.ts";
  import Star from "lucide-svelte/icons/star";
  import MapPin from "lucide-svelte/icons/map-pin";
  import GraduationCap from "lucide-svelte/icons/graduation-cap";
  import Brain from "lucide-svelte/icons/brain";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import ChevronUp from "lucide-svelte/icons/chevron-up";
  import { websiteName } from "src/lib/shared/constants/constants.ts";

  export let data: PageData;
  $: ({ profile, uploadAvatarForm, deleteAvatarForm } = data);

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
  const bioForm = superForm(data.updateBioForm, {
    validators: zodClient(updateBioSchema),
    onUpdated({ form }) {
      if (form.valid) {
        bioReset({ newState: data.updateBioForm.data });
        toast.success(`Ändrat profilbeskrivning.`);
      }
    },
    resetForm: false,
  });
  const emailForm = superForm(data.updateEmailForm, {
    validators: zodClient(emailSchema),
    resetForm: false,
  });
  const deleteForm = superForm(data.deleteAccountForm, {
    validators: zodClient(deleteSchema),
  });
  const passwordForm = superForm(data.updatePasswordForm, {
    validators: zodClient(changePasswordSchema),
  });

  const { form: nameData, reset: nameReset } = nameForm;
  const { form: bioData, reset: bioReset } = bioForm;
  const { form: emailData } = emailForm;
  const { form: passwordData } = passwordForm;
</script>

<svelte:head>
  <title>{websiteName} | Inställningar</title>
</svelte:head>

<AccountLayout>
  <PrimaryTitle class="text-center">Inställningar</PrimaryTitle>
  <Container class="w-full " minWidth maxWidth padding>
    {#if profile.role === "teacher"}
      <SettingsForm
        form={bioForm}
        action="?/bio"
        title="Profilbeskrivning"
        submitText="Ändra"
        id="bio"
      >
        <p class="text-muted-foreground">
          Detta är en beskrivning för din lärarprofil, som visas för alla dina
          annonser. Beskrivningar för individuella <a
            href="/account/listings"
            class="underline">annonser</a
          > ändras separat.
        </p>
        <Collapsible.Root>
          <Collapsible.Trigger
            class="group flex w-full items-center justify-between gap-x-2 text-start text-muted-foreground"
            >Några exempel på saker du kan nämna i din profilbeskrivning:
            <div class="p-0 text-foreground group-data-[state=open]:hidden">
              <ChevronDown class="size-4" />
              <span class="sr-only">Öppna</span>
            </div>
            <div class="p-0 text-foreground group-data-[state=closed]:hidden">
              <ChevronUp class="size-4 " />
              <span class="sr-only">Öppna</span>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content class="mt-2 text-muted-foreground md:mt-1">
            {@const styling = "size-button-icon flex-shrink-0 md:size-7"}
            <ul
              class="list-disc space-y-1.5 *:mx-1 *:flex *:gap-x-2 md:space-y-2"
            >
              <li>
                <Star class={styling} />Din expertis.
              </li>
              <li>
                <GraduationCap class={styling} />Dina erfarenheter som lärare.
              </li>
              <li>
                <MapPin class={styling} />Om du helst lär ut online eller
                fysiskt (isåfall även plats).
              </li>
              <li>
                <Brain class={styling} />Ditt tillvägagångssätt som lärare.
              </li>
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
        <Form.Field form={bioForm} name="bio">
          <Form.Control let:attrs>
            <Form.Label>Profilbeskrivning</Form.Label>
            <Textarea
              {...attrs}
              placeholder="Skriv en text om dig själv som lärare..."
              class="max-h-[500px] min-h-32 resize-y md:max-h-[700px]"
              style={"field-sizing: content"}
              bind:value={$bioData.bio}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </SettingsForm>
    {/if}

    <SettingsForm
      form={nameForm}
      action="?/name"
      title="Namn"
      submitText="Ändra"
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
    </SettingsForm>

    <SettingsForm
      form={emailForm}
      action="?/email"
      title="E-postadress"
      submitText="Ändra"
    >
      <p class="text-muted-foreground">
        Du kommer behöva bekräfta den nya <span class="italic">och</span> den gamla
        adressen.
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
      {uploadAvatarForm}
      {deleteAvatarForm}
      avatarUrl={profile.avatarUrl ?? ""}
    />

    <SettingsForm
      form={passwordForm}
      action="?/password"
      title="Lösenord"
      submitText="Ändra"
    >
      <Form.Field form={passwordForm} name="current">
        <Form.Control let:attrs>
          <Label>Nuvarande lösenord</Label>
          <PasswordInput formData={passwordData} {attrs} placeholder="" />
        </Form.Control>
        <Form.Description />
        <Form.FieldErrors />
      </Form.Field>
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
    </SettingsForm>

    <DeleteAccount form={deleteForm} />
  </Container>
</AccountLayout>
