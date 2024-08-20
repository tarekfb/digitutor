<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { formatBytes } from "$lib/utils.js";
  import SecondaryTitle from "../atoms/secondary-title.svelte";
  import {
    getMimeType,
    maxAvatarSize,
  } from "src/lib/shared/constants/constants.js";
  import Label from "$lib/components/atoms/label.svelte";
  import * as Form from "$lib/components/ui/form";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms/client";

  export let uploadAvatarForm;

  const form = superForm(uploadAvatarForm, {
    onUpdated({ form }) {
      if (form.valid) {
        toast.success(`Ändrat profilbild.`);
      }
    },
    delayMs: 0,
    timeoutMs: 4000
  });

  const {
    enhance,
    allErrors,
    message,
    formData,
    delayed,
    timeout,
  } = form;
  const setAvatar = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => {
    form.reset();
    $formData.avatar = e.currentTarget?.files?.item(0) as File;
  };
</script>

<form
  method="POST"
  use:enhance
  action="?/avatar"
  class="flex flex-col gap-y-4 generic-card"
  enctype="multipart/form-data"
>
  <SecondaryTitle>Profilbild</SecondaryTitle>
  <p class="text-muted-foreground">
    Maxstorlek är {formatBytes(maxAvatarSize)}.
  </p>
  <Form.Field {form} name="avatar">
    <Form.Control let:attrs>
      <Label>Profilbild</Label>
      <input
        {...attrs}
        type="file"
        name="avatar"
        bind:value={$formData.avatar}
        accept={getMimeType()}
        class="overflow-hidden flex h-10 w-full border border-input rounded-md bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        on:input={(e) => setAvatar(e)}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <FormMessage {message} scroll />
  <Button
    type="submit"
    class="md:self-center md:min-w-wider"
    disabled={$allErrors.length > 0 || $delayed}
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
