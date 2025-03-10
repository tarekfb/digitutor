<script lang="ts">
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import Label from "$lib/components/atoms/label.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import Link from "$lib/components/atoms/link.svelte";
  import Container from "src/lib/components/templates/container.svelte";
  import type { PageData } from "./$types.ts";
  import SendHorizontal from "lucide-svelte/icons/send-horizontal";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
  import { reportBugSchema } from "src/lib/shared/models/report-bug.ts";
  import * as Collapsible from "$lib/components/ui/collapsible/index.ts";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import ChevronUp from "lucide-svelte/icons/chevron-up";

  export let data: PageData;

  const contactForm = superForm(data.form, {
    validators: zodClient(reportBugSchema),
    onUpdated({ form }) {
      if (form.valid)
        toast.success(
          `Rapport skickat. Vi följer upp ärendet så snart vi kan.`,
        );
    },
  });

  const { form: formData, enhance, delayed, message, allErrors } = contactForm;
</script>

<svelte:head>
  <title>{websiteName} | Rapportera fel</title>
</svelte:head>

<Container responsiveGap maxWidth minWidth padding>
  <div
    class="flex flex-col items-center justify-center gap-y-0.5 md:self-start"
  >
    <PrimaryTitle class="mb-2 md:mb-4">Rapportera ett fel</PrimaryTitle>
    <p class="text-lg md:text-xl">
      Här kan du rapportera buggar eller andra fel. Vill du bara ge feedback,
      önskemål eller klagomål kan du istället gå till <Link
        class="text-lg"
        href="/contact-us">kontakta oss</Link
      >.
    </p>
  </div>
  <p class="text-muted-foreground md:self-start md:text-lg">
    Vi svarar dig så fort vi kan.
  </p>

  <form
    class="flex w-full flex-col gap-y-2 text-lg md:gap-y-4 md:text-xl"
    method="POST"
    action="?/submit"
    use:enhance
  >
    <Form.Field form={contactForm} name="description">
      <Form.Control let:attrs>
        <Label>Beskrivning</Label>
        <p class="text-sm text-muted-foreground">
          Detta är en beskrivning över felet som uppstod.
        </p>
        <Collapsible.Root class="text-sm">
          <Collapsible.Trigger
            class=" group mb-1 flex w-full items-center justify-between gap-x-2 text-start text-muted-foreground"
            >Några exempel på vad som är bra att nämna i en felbeskrivning:
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
            <ul class="list-inside list-disc space-y-1.5 md:space-y-2">
              <li>Hur felet uppstod - vad gjorde du när det hände?</li>
              <li>Din webbläsare, t.ex. chrome eller safari.</li>
              <li>Om du löste problemet, vad gjorde du för att lösa det?</li>
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
        <Textarea
          {...attrs}
          placeholder="Hur uppstod felet? Vilken webbläsare? Löstes problemet, hur?"
          class="max-h-[500px] min-h-32 resize-y bg-card md:max-h-[700px]"
          style={"field-sizing: content"}
          bind:value={$formData.description}
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field form={contactForm} name="trackingId">
      <Form.Control let:attrs>
        <Label>Autogenererat ID</Label>
        <p class="text-sm text-muted-foreground">Fältet fylls i automatiskt.</p>
        <Input
          {...attrs}
          placeholder="Detta fylls i automatiskt..."
          class="cursor-not-allowed bg-card text-muted-foreground"
          bind:value={$formData.trackingId}
          type="text"
          readonly
        />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <FormMessage {message} scroll />
    <FormSubmit
      {delayed}
      {allErrors}
      text="Skicka"
      class="wide-button self-center"
    >
      <SendHorizontal slot="icon" class="size-button-icon" />
    </FormSubmit>
  </form>
</Container>
