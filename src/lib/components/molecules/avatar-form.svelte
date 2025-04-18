<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import FormMessage from "../molecules/form-message.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { formatBytes } from "src/lib/shared/utils/utils.js";
  import {
    getMimeType,
    maxAvatarSize,
  } from "src/lib/shared/constants/constants.js";
  import { toast } from "svelte-sonner";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms/client";
  import DeleteAvatar from "$lib/components/molecules/delete-avatar.svelte";
  import Dropzone from "svelte-file-dropzone";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    avatarSchema,
    deleteAvatarSchema,
    isValidFileSize,
  } from "$lib/shared/models/profile.ts";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let uploadAvatarForm: SuperValidated<Infer<typeof avatarSchema>>;
  export let avatarUrl: string;
  export let deleteAvatarForm: SuperValidated<Infer<typeof deleteAvatarSchema>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilesSelect = (e: any) => {
    const { acceptedFiles } = e.detail;
    if (acceptedFiles && acceptedFiles.length > 0) {
      submitAvatar(acceptedFiles[0]);
    }
  };

  const formRoot = superForm(uploadAvatarForm, {
    validators: zodClient(avatarSchema),
    onUpdated({ form }) {
      if (form.valid) toast.success(`Sparat profilbild.`);
    },
    delayMs: 0,
    timeoutMs: 4000,
  });

  const {
    enhance,
    allErrors,
    errors,
    message,
    form,
    delayed,
    timeout,
    submit,
  } = formRoot;

  const submitAvatar = (avatar?: File | null) => {
    if (!avatar) return;
    if (!avatar.type) return;
    formRoot.reset();
    $form.avatar = avatar;
    if ($allErrors.length === 0 && !isBadHeic(avatar)) submit();
  };

  const isBadHeic = (avatar?: File) => {
    if (!avatar) return false;
    if (avatar.type === "" && avatar.name.endsWith(".heic")) return true;
    return false;
  };

  let fileInput: HTMLInputElement; // Reference to the file input element
  const triggerFileInput = () => {
    fileInput.click();
  };
</script>

<div class="generic-card flex w-full flex-col gap-y-4 overflow-x-hidden">
  <SecondaryTitle>Profilbild</SecondaryTitle>
  <p class="text-muted-foreground">
    Maxstorlek är {formatBytes(maxAvatarSize)}.
  </p>
  <form
    method="POST"
    use:enhance
    action="?/avatar"
    class="flex flex-col gap-y-4"
    enctype="multipart/form-data"
  >
    {#if avatarUrl}
      <div class="relative self-center">
        <button type="button" on:click={triggerFileInput}>
          <img
            src={avatarUrl}
            alt="profilbild"
            width="250"
            height="250"
            class="self-center rounded-md object-cover shadow-md"
          />
        </button>
        <DeleteAvatar rootForm={deleteAvatarForm} />
      </div>
      <Form.Field form={formRoot} name="avatar">
        <Form.Control let:attrs>
          <Label>Profilbild</Label>
          <input
            {...attrs}
            type="file"
            bind:this={fileInput}
            name="avatar"
            id="avatar-file-input"
            bind:value={$form.avatar}
            accept={getMimeType()}
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            on:change={(e) => submitAvatar(e.currentTarget?.files?.item(0))}
          />
        </Form.Control>
        {#if $errors.avatar && !isBadHeic($form.avatar)}
          <Form.FieldErrors>
            {#if !isValidFileSize($form.avatar)}
              <p>{$errors.avatar}</p>
              <p>Din filstorlek är {formatBytes($form.avatar.size)}.</p>
            {:else}
              <p>{$errors.avatar}</p>
            {/if}
          </Form.FieldErrors>
        {/if}
      </Form.Field>
    {:else}
      <Dropzone
        on:drop={handleFilesSelect}
        name="avatar"
        multiple={false}
        bind:value={$form.avatar}
        accept={getMimeType()}
      >
        <p>Dra och släpp en bild här, eller klicka för att välja en bild</p>
      </Dropzone>
      <div class="space-y-2">
        {#if $form.avatar?.name}
          <p>{$form.avatar.name}</p>
        {/if}
        {#if $errors.avatar && !isBadHeic($form.avatar)}
          <Form.FieldErrors>
            {#if !isValidFileSize($form.avatar)}
              <p>{$errors.avatar}</p>
              <p>Din filstorlek är {formatBytes($form.avatar.size)}.</p>
            {:else}
              <p>{$errors.avatar}</p>
            {/if}
          </Form.FieldErrors>
        {/if}
      </div>
    {/if}
    <FormMessage {message} scroll />
    <Button
      type="submit"
      class="wide-button md:self-center"
      disabled={$allErrors.length > 0 || $delayed || !$form.avatar}
    >
      {#if $timeout}
        <LoadingSpinner class="mr-2" />
        Byter algoritm...
      {:else if $delayed}
        <LoadingSpinner class="mr-2" />
        Komprimerar...
      {:else}
        Spara
      {/if}
    </Button>
  </form>
</div>
