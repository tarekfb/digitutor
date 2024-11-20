<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { formatBytes } from "src/lib/shared/utils/utils.js";
  import {
    getMimeType,
    maxAvatarSize,
  } from "src/lib/shared/constants/constants.js";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms/client";
  import DeleteAvatar from "$lib/components/molecules/delete-avatar.svelte";
  import Dropzone from "svelte-file-dropzone";
  import * as Form from "$lib/components/ui/form";
  import { Label } from "$lib/components/ui/label/index.js";
  export let uploadAvatarForm;
  export let avatarUrl: string
  export let deleteAvatarForm;

  const handleFilesSelect = (e: any) => {
    const { acceptedFiles } = e.detail;
    if (acceptedFiles && acceptedFiles.length > 0) {
      setAvatar(acceptedFiles[0]);
    }
  };

  const formRoot = superForm(uploadAvatarForm, {
    onUpdated({ form }) {
      if (form.valid) toast.success(`Ändrat profilbild.`);
    },
    delayMs: 0,
    timeoutMs: 4000,
  });

  const { enhance, allErrors, errors, message, form, delayed, timeout } =
    formRoot;
  const setAvatar = (avatar?: File | null) => {
    if (!avatar) return;
    if (!avatar.type) return;
    formRoot.reset();
    $form.avatar = avatar;
  };

  const isBadHeic = (avatar?: File) => {
    if (!avatar) return false;
    if (avatar.type === "" && avatar.name.endsWith(".heic")) return true;
    return false;
  };
</script>

<div class="flex flex-col gap-y-4 generic-card w-full">
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
        <img
          src={avatarUrl}
          alt="profilbild"
          width="250"
          height="250"
          class="object-cover self-center rounded-md shadow-md"
        />
        <DeleteAvatar rootForm={deleteAvatarForm} />
      </div>
      <Form.Field form={formRoot} name="avatar">
        <Form.Control let:attrs>
          <Label>Profilbild</Label>
          <input
            {...attrs}
            type="file"
            name="avatar"
            bind:value={$form.avatar}
            accept={getMimeType()}
            class="overflow-hidden flex h-10 w-full border border-input rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            on:input={(e) => setAvatar(e.currentTarget?.files?.item(0))}
          />
        </Form.Control>
        {#if $errors.avatar && isBadHeic($form.avatar)}
          <Form.FieldErrors />
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
        {#if $errors.avatar && isBadHeic($form.avatar)}
          <Form.FieldErrors />
        {/if}
      </div>
    {/if}
    <FormMessage {message} scroll />
    <Button
      type="submit"
      class="md:self-center md:min-w-wider"
      disabled={$allErrors.length > 0 || $delayed || !$form.avatar}
    >
      {#if $timeout}
        <LoadingSpinner class="mr-2" />
        Byter algoritm...
      {:else if $delayed}
        <LoadingSpinner class="mr-2" />
        Komprimerar...
      {:else}
        Ändra
      {/if}
    </Button>
  </form>
</div>
