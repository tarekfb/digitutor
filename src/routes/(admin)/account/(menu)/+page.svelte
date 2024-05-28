<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import * as Dialog from "$lib/components/ui/dialog";
  import ListingCard from "$lib/components/molecules/listing-card.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { initCreateListingSchema } from "$lib/models/listing";
  import StudentAccount from "src/lib/components/organisms/student-account.svelte";
  import * as Form from "$lib/components/ui/form";
  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import { mediaQuery } from "svelte-legos";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import Title from "$lib/components/atoms/title.svelte";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";

  let open = false;
  const isDesktop = mediaQuery("(min-width: 768px)");

  let adminSection: Writable<string> = getContext("adminSection");
  adminSection.set("dashboard");

  export let data;
  const { listings, conversations } = data;

  const form = data.form as SuperValidated<
    {
      title: string;
    },
    any,
    {
      title: string;
    }
  >;
  // this is complaining about potential undefined. Maybe there's an issue with parent serving data?
  // anyway, proceeding with this dirty hack...

  const userForm = superForm(form, {
    validators: zodClient(initCreateListingSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const { form: formData, enhance, submitting, message, allErrors } = userForm;
</script>

<svelte:head>
  <title>Konto</title>
</svelte:head>

{#if data.profile.role === "teacher"}
  <Title>Dina annonser</Title>

  <div class="flex flex-col gap-y-4 my-6">
    {#if !listings}
      <p>Kunde inte hämta annonser.</p>
    {:else if listings.length === 0}
      <p>Inga annonser. Testa skapa en!</p>
    {:else}
      {#each listings as listing}
        <a href="/listing/{listing.id}" aria-label="Navigate to ad">
          <ListingCard {listing} />
        </a>
      {/each}
    {/if}

    {#if $isDesktop}
      <Dialog.Root bind:open>
        <Dialog.Trigger asChild let:builder>
          <Button builders={[builder]}>Skapa annons</Button>
        </Dialog.Trigger>
        <Dialog.Content
          class="flex flex-col gap-y-4 px-4 bg-card sm:max-w-[425px]"
        >
          <Dialog.Header>
            <Dialog.Title>Skapa annons</Dialog.Title>
            <Dialog.Description>
              Du kan fylla i mer information om annonsen i nästa steg.
            </Dialog.Description>
          </Dialog.Header>
          <FormMessage {message} scroll />
          <form method="POST" action="?/createListing" use:enhance>
            <div class="grid gap-4 py-4">
              <Form.Field form={userForm} name="title">
                <Form.Control let:attrs>
                  <Input
                    {...attrs}
                    type="text"
                    bind:value={$formData.title}
                    placeholder="Rubrik"
                  />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <Dialog.Footer>
              <Button
                type="submit"
                disabled={$allErrors.length > 0 || $submitting}
              >
                {#if $submitting}
                  <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
                {:else}
                  Skapa
                {/if}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    {:else}
      <Drawer.Root bind:open>
        <Drawer.Trigger asChild let:builder>
          <div class="flex justify-end w-full">
            <Button builders={[builder]}>Skapa annons</Button>
          </div>
        </Drawer.Trigger>
        <Drawer.Content class="flex flex-col bg-card px-8">
          <Drawer.Header class="text-left">
            <Drawer.Title>Skapa annons</Drawer.Title>
            <Drawer.Description>
              Du kan fylla i mer information om annonsen i nästa steg.
            </Drawer.Description>
          </Drawer.Header>
          <FormMessage {message} scroll class="mb-4" />
          <form method="POST" action="?/createListing" use:enhance>
            <Form.Field form={userForm} name="title">
              <Form.Control let:attrs>
                <Input
                  {...attrs}
                  type="text"
                  bind:value={$formData.title}
                  placeholder="Rubrik"
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <Drawer.Footer>
              <Button
                type="submit"
                disabled={$allErrors.length > 0 || $submitting}
              >
                {#if $submitting}
                  <LoadingSpinner class="mr-2" /> <span>Laddar...</span>
                {:else}
                  Skapa
                {/if}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer.Root>
    {/if}
  </div>
{:else}
  <StudentAccount {conversations} />
{/if}
