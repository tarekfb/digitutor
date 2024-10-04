<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { formatBytes } from "$lib/utils.js";
  import {
    getMimeType,
    maxAvatarSize,
  } from "src/lib/shared/constants/constants.js";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms/client";
  import DeleteAvatar from "$lib/components/molecules/delete-avatar.svelte";
  import Dropzone from "svelte-file-dropzone";

  export let uploadAvatarForm;
  export let avatarUrl: string | null;
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

  const { enhance, allErrors, message, form, delayed, timeout } = formRoot;
  const setAvatar = (avatar: File) => {
    console.log(avatar);
    formRoot.reset();
    $form.avatar = avatar;
  };
</script>

<div class="flex flex-col gap-y-4 generic-card">
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
          on:input={(e) => setAvatar(e)}
      </div>
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
      {#if $form.avatar?.name}
        <p>{$form.avatar.name}</p>
      {/if}
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
