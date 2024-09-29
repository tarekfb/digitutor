<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormMessage from "../molecules/form-message.svelte";
  import FormSubmit from "../molecules/form-submit.svelte";
  import SecondaryTitle from "$lib/components/atoms/secondary-title.svelte";
  import * as Form from "$lib/components/ui/form";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import PasswordInput from "../molecules/password-input.svelte";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { formatBytes } from "$lib/utils.js";
  import {
    getMimeType,
    maxAvatarSize,
  } from "src/lib/shared/constants/constants.js";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms/client";
  import { X } from "lucide-svelte";

  export let uploadAvatarForm;
  export let profile;

  let open = false;
  const isDesktop = mediaQuery("(min-width: 768px)");
  const title = "Är du säker?";
  const description =
    "Detta går inte att ångra. Tar du bort bilden försvinner den permanent.";

  const form = superForm(uploadAvatarForm, {
    onUpdated({ form }) {
      if (form.valid) toast.success(`Ändrat profilbild.`);
    },
    delayMs: 0,
    timeoutMs: 4000,
  });

  const { enhance, allErrors, message, formData, delayed, timeout } = form;
  const setAvatar = (
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => {
    form.reset();
    $formData.avatar = e.currentTarget?.files?.item(0) as File;
  };
</script>

<!-- move div  new form only for removal -->

<div class="flex flex-col gap-y-4 generic-card">
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
    {#if profile.avatar_url}
      <div class="relative self-center">
        <img
          src={profile.avatar_url}
          alt="profilbild"
          width="250"
          height="250"
          class="object-cover self-center rounded-md shadow-md"
        />
        {#if $isDesktop}
          <Dialog.Root bind:open>
            <Dialog.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="destructive"
                disabled={$delayed}
                aria-label="Ta bort profilbild"
                size="icon"
                class="absolute -top-2.5 -right-2.5 rounded-full"
              >
                {#if $delayed}
                  <LoadingSpinner class="" /> <span>Laddar...</span>
                {:else}
                  <X />
                {/if}
              </Button>
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[425px] bg-card">
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>
                  {description}
                </Dialog.Description>
              </Dialog.Header>
              <div class="flex justify-end gap-x-4">
                <Dialog.Footer>
                  <Dialog.Close asChild let:builder>
                    <Button variant="outline" builders={[builder]}
                      >Avbryt</Button
                    >
                  </Dialog.Close>
                </Dialog.Footer>
                <FormSubmit
                  {delayed}
                  {allErrors}
                  text="Ta bort"
                  variant="destructive"
                />
              </div>
            </Dialog.Content>
          </Dialog.Root>
        {:else}
          <Drawer.Root bind:open>
            <Drawer.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="destructive"
                disabled={$delayed}
                aria-label="Ta bort profilbild"
                size="icon"
                class="absolute -top-2.5 -right-2.5 rounded-full"
              >
                {#if $delayed}
                  <LoadingSpinner class="" />
                {:else}
                  <X />
                {/if}
              </Button>
            </Drawer.Trigger>
            <Drawer.Content class="bg-card">
              <Drawer.Header class="text-left">
                <Drawer.Title>{title}</Drawer.Title>
                <Drawer.Description>
                  {description}
                </Drawer.Description>
              </Drawer.Header>
              <Drawer.Footer class="flex justify-end gap-x-2">
                <Drawer.Close asChild let:builder>
                  <Button variant="outline" builders={[builder]}>Avbryt</Button>
                </Drawer.Close>
                <FormSubmit
                  {delayed}
                  {allErrors}
                  text="Ta bort"
                  variant="destructive"
                />
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        {/if}
      </div>
    {:else}
      <div class="bg-white p-10 border-testing"></div>
    {/if}
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
</div>
