<script lang="ts">
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { updateListingSchema } from "$lib/shared/models/listing.js";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import type { PageData } from "./$types.ts";
  import Container from "src/lib/components/templates/container.svelte";
  import DeleteListing from "$lib/components/atoms/delete-listing.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import { MessageId } from "src/lib/shared/constants/constants.ts";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";
  import SaveIcon from "lucide-svelte/icons/save";
  import ExternalLink from "lucide-svelte/icons/square-arrow-out-up-right";
  import { Checkbox } from "src/lib/components/ui/checkbox/index.js";
  import Svelecte from "svelecte";
  import { arrayProxy } from "sveltekit-superforms/client";
  import { Label } from "src/lib/components/ui/label/index.ts";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import AccountLayout from "src/lib/components/templates/account-layout.svelte";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
  import { suggestSubjectSchema } from "src/lib/shared/models/subject.ts";

  export let data: PageData;
  $: ({ subjects, profile } = data);
  const { slug } = $page.params;

  const listingForm = superForm(data.updateListingForm, {
    validators: zodClient(updateListingSchema),
    onUpdated({ form }) {
      if (form.valid) {
        reset({ newState: data.updateListingForm.data });
        toast.success(`Annons uppdaterad.`);
      }
    },
    taintedMessage: "Vill du lämna sidan? Ändringarna har inte sparats ännu.",
    resetForm: false,
  });

  const {
    form,
    message,
    errors,
    enhance,
    delayed,
    reset,
    allErrors,
    isTainted,
  } = listingForm;
  const { values, errors: subjectsErrors } = arrayProxy(
    listingForm,
    "subjects",
    {
      taint: true,
    },
  );

  const labelStyling = "text-xl md:text-2xl";

  let open = false;

  const suggestSubject = superForm(data.suggestSubjectForm, {
    validators: zodClient(suggestSubjectSchema),
    onSubmit({ formData, cancel }) {
      if (checked && !$formSuggestSubject.email) {
        toast.warning("Ange e-postaddress för att bli notifierad.");
        cancel();
        return;
      } else if (
        $messageSuggestSubject &&
        $messageSuggestSubject.id === MessageId.ResourceAlreadyExists
      ) {
        formData.set("isRetry", "true");
      }
      if (isTainted()) {
        const answer = confirm(
          "Om du har ändrat något i annonsen kommer detta inte sparas. Är du säker på att du vill fortsätta?",
        );
        if (!answer) cancel();
      }
    },
    onUpdate({ form }) {
      if (form.valid) {
        open = false;
        const actionText = checked
          ? "Vi kontaktar dig så snart vi kan."
          : "Vi hanterar ärendet så snart vi kan.";
        setTimeout(
          () => toast.success(`Skickat in förslaget. ${actionText}`),
          250,
        );
        // timeout to improve ux
      }
    },
  });

  let checked = false;
  $: submitText =
    $messageSuggestSubject?.id === MessageId.ResourceAlreadyExists
      ? "Skicka in igen"
      : "Skicka in";

  const {
    form: formSuggestSubject,
    enhance: enhanceSuggestSubject,
    delayed: delayedSuggestSubject,
    allErrors: allErrorsSuggestSubject,
    message: messageSuggestSubject,
  } = suggestSubject;

  const cleanEmail = () => {
    // the on click is executed before the checked value is updated causing checked value to be inverted
    // what we are saying: if user is detoggling the checkbox --> clear the email input
    if (checked) $formSuggestSubject.email = undefined;
  };
</script>

<svelte:head>
  <title>{websiteName} | Redigera annons</title>
</svelte:head>

<AccountLayout>
  <PrimaryTitle class="text-center">Redigera annons</PrimaryTitle>
  <Container class="w-full" minWidth maxWidth padding>
    <Dialog.Root bind:open>
      <form
        method="POST"
        use:enhance
        action="?/updateListing"
        class="flex w-full flex-col items-stretch gap-y-4"
      >
        <Form.Field form={listingForm} name="title">
          <Form.Control let:attrs>
            <Label class={labelStyling}>Rubrik</Label>
            <Input
              {...attrs}
              type="text"
              bind:value={$form.title}
              placeholder="Rubrik"
              class="bg-card text-lg"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field form={listingForm} name="hourlyPrice">
          <Form.Control let:attrs>
            <Label class={labelStyling}>Timpris</Label>
            <div class="flex items-center gap-x-2 text-xl">
              <Input
                {...attrs}
                type="number"
                inputmode="numeric"
                pattern="[0-9]+"
                bind:value={$form.hourlyPrice}
                placeholder="Ange timpris"
                class="w-32 bg-card"
              />
              SEK
            </div>
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field form={listingForm} name="description">
          <Form.Control let:attrs>
            <Label class={labelStyling}>Beskrivning</Label>
            <p class="text-muted-foreground">
              Detta är en beskrivning för denna annons. Profilbeskrivningen som
              visas för alla dina annonser kan ändras i <a
                href="/account/settings#bio"
                class="underline">profilinställningar</a
              >.
            </p>
            <Textarea
              {...attrs}
              class="max-h-[500px] min-h-32 resize-y bg-card md:max-h-[700px]"
              style={"field-sizing: content"}
              placeholder="Skriv några ord om din annons..."
              bind:value={$form.description}
            />
          </Form.Control>
          <Form.FieldErrors>
            {#if $errors.description?.at(0)}
              {$errors.description?.at(0)}
            {/if}
          </Form.FieldErrors>
        </Form.Field>

        <Form.Field form={listingForm} name="subjects">
          <Form.Control let:attrs>
            <Label class={labelStyling}>Språk</Label>
            <Svelecte
              {...attrs}
              bind:value={$values}
              multiple
              max={10}
              placeholder="Välj språk"
              options={subjects}
              highlightFirstItem={false}
              labelField="title"
              name="subjects"
              clearable
            />
          </Form.Control>
          <Form.FieldErrors>
            {#if $subjectsErrors}
              {$subjectsErrors}
            {/if}
          </Form.FieldErrors>
        </Form.Field>

        <Dialog.Trigger asChild let:builder>
          <small
            class="-mt-4 flex items-center justify-center gap-x-2 text-muted-foreground md:-mt-2 md:text-lg"
            >Saknar du något i listan? <Button
              variant="link"
              class="px-0"
              builders={[builder]}>Ge förslag</Button
            ></small
          >
        </Dialog.Trigger>
        <FormMessage {message} scroll />

        <div class="mt-4 flex flex-col gap-y-4 md:items-end">
          <div class="flex items-center justify-between gap-x-2 md:gap-x-6">
            <Form.Field form={listingForm} name="visible">
              <Form.Control let:attrs>
                <div class="flex items-center gap-x-2">
                  <Checkbox
                    {...attrs}
                    bind:checked={$form.visible}
                    class="flex h-5 w-5 items-center justify-center"
                  />
                  <Form.Label class="text-xl">Synlig</Form.Label>
                </div>
                <input
                  name={attrs.name}
                  bind:checked={$form.visible}
                  type="checkbox"
                  value={$form.visible}
                  hidden
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <Button
              variant="outline"
              href="/profile/{profile.id}?id={slug}"
              class="flex gap-x-2 bg-card"
              ><ExternalLink class="h-4 w-4" />visa annons</Button
            >
          </div>
          <div class="flex justify-between gap-x-2 md:gap-x-6">
            <DeleteListing />
            <FormSubmit {delayed} {allErrors} text="Spara">
              <SaveIcon slot="icon" class="h-5 w-5" />
            </FormSubmit>
          </div>
        </div>
      </form>
      <Dialog.Content class="bg-card sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Skicka in förslag</Dialog.Title>
          <Dialog.Description>
            Vill du föreslå något som saknades bland alternativen? Skicka in
            förslaget så hanterar vi ärendet så snart vi kan.
          </Dialog.Description>
        </Dialog.Header>
        <FormMessage
          message={messageSuggestSubject}
          class={$messageSuggestSubject?.variant === "destructive"
            ? "bg-card"
            : "bg-background"}
        />
        <form
          method="POST"
          action="?/suggestSubject"
          use:enhanceSuggestSubject
          class="flex flex-col gap-y-4"
          autocomplete="off"
        >
          <Form.Field form={suggestSubject} name="subject">
            <Form.Control let:attrs>
              <Label>Detta saknades i listan</Label>
              <Input
                {...attrs}
                type="text"
                bind:value={$formSuggestSubject.subject}
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          {#if checked}
            <Form.Field form={suggestSubject} name="email">
              <Form.Control let:attrs>
                <Label>E-postadress</Label>
                <Input
                  {...attrs}
                  type="text"
                  bind:value={$formSuggestSubject.email}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          {/if}
          <div class="flex items-center space-x-2">
            <Checkbox
              id="toggle-email"
              bind:checked
              aria-labelledby="show-email"
              on:click={cleanEmail}
            />
            <Label
              id="show-email"
              for="toggle-email"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notifiera mig
            </Label>
          </div>
          <div class="flex justify-end gap-x-4">
            <Dialog.Footer>
              <Dialog.Close asChild let:builder>
                <Button variant="outline" builders={[builder]}>Avbryt</Button>
              </Dialog.Close>
            </Dialog.Footer>
            <FormSubmit
              delayed={delayedSuggestSubject}
              allErrors={allErrorsSuggestSubject}
              text={submitText}
            />
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  </Container>
</AccountLayout>
