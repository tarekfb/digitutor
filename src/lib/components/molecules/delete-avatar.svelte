<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import FormSubmit from "../molecules/form-submit.svelte";
  import { mediaQuery } from "svelte-legos";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import LoadingSpinner from "$lib/components/atoms/loading-spinner.svelte";
  import { X } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms/client";

  export let rootForm;

  const deleteForm = superForm(rootForm, {
    onUpdate({ form }) {
      const text = form.valid
        ? "Tagit bort profilbild."
        : "Något gick fel, kontakta oss om detta fortsätter.";
      if (!form.valid) {
        open = false;
        if (isDesktop) setTimeout(() => toast.error(text), 500);
        else toast.error(text);
      } else {
        if (isDesktop) setTimeout(() => toast.success(text), 500);
        else toast.error(text);
      }
      // timeout to avoid visual bug
    },
  });

  let open = false;
  const { enhance, allErrors, form, delayed } = deleteForm;
  const isDesktop = mediaQuery("(min-width: 768px)");
  const title = "Är du säker på att du vill ta bort bilden?";
  const description =
    "Detta går inte att ångra. Tar du bort bilden försvinner den permanent.";
</script>

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
      <form
        class="flex justify-end gap-x-4"
        method="POST"
        action="?/deleteAvatar"
        use:enhance
      >
        <Dialog.Footer>
          <input type="hidden" name="path" value={$form.path} />
          <Dialog.Close asChild let:builder>
            <Button variant="outline" builders={[builder]}>Avbryt</Button>
          </Dialog.Close>
          <FormSubmit
            {delayed}
            {allErrors}
            text="Ta bort"
            variant="destructive"
          />
        </Dialog.Footer>
      </form>
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
      <Drawer.Footer>
        <form
          class="flex justify-end gap-x-2"
          method="POST"
          action="?/deleteAvatar"
          use:enhance
        >
          <input type="hidden" name="path" value={$form.path} />

          <Drawer.Close asChild let:builder>
            <Button variant="outline" builders={[builder]}>Avbryt</Button>
          </Drawer.Close>
          <FormSubmit
            {delayed}
            {allErrors}
            text="Ta bort"
            variant="destructive"
          />
        </form>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
