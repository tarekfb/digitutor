<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
  import DeleteListing from "$lib/components/listing/delete-listing.svelte";
  import MissingListing from "$lib/components/listing/missing-listing.svelte";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { createListingSchema } from "$lib/models/listing";
  import DescriptionEditable from "src/lib/components/listing/description-editable.svelte";
  import TitleEditable from "src/lib/components/listing/title-editable.svelte";
  import SubjectsEditable from "src/lib/components/listing/subjects-editable.svelte";
  import HourlyPriceEditable from "src/lib/components/listing/hourly-price-editable.svelte";
  import NonEditableListing from "src/lib/components/listing/non-editable-listing.svelte";
  import LoadingSpinner from "src/lib/components/atoms/loading-spinner.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Form from "$lib/components/ui/form/index.js";
  import VisibilityEditable from "src/lib/components/listing/visibility-editable.svelte";
  import { SaveIcon, X, Pencil } from "lucide-svelte";
  import { convertToInitials } from "src/lib/utils.js";
  import Title from "src/lib/components/atoms/title.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { goto } from "$app/navigation";
  import type { Conversation } from "src/lib/models/conversations.js";
  import { sendMessageSchema } from "src/lib/models/conversations";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  export let data;
  const { profile, messages, form } = data;
  const conversation = data.conversation;
  const title =
    profile.role === "teacher"
      ? `${conversation.student.first_name} ${conversation.student.last_name}`
      : `${conversation.teacher.first_name} ${conversation.teacher.last_name}`;

  const sendMessageForm = superForm(form, {
    validators: zodClient(sendMessageSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
  });
  const {
    form: formData,
    enhance,
    submitting,
    message,
    allErrors,
  } = sendMessageForm;
</script>

<div class="flex flex-col gap-y-4">
  {#if conversation}
    <div class="flex gap-x-4">
      <Title>{title}</Title>
      <Button class="relative h-8 w-8 rounded-full">
        <Avatar.Root class="h-8 w-8 flex justify-center text-xs items-center ">
          <Avatar.Fallback class="text-background bg-primary"
            >{convertToInitials(
              title.split(" ")[0],
              title.split(" ")[1],
            )}</Avatar.Fallback
          >
        </Avatar.Root>
      </Button>
    </div>

    {#each messages as message}
      <div
        class="flex flex-col gap-y-1 bg-card p-2 rounded-md {message.sender ===
        profile.id
          ? 'self-end'
          : 'self-start'}"
      >
        <p>{message.content}</p>
        <p class="text-sm text-muted-foreground">
          {message.created_at.substring(0, 10)}
        </p>
      </div>
    {:else}
      <p>Inga meddelanden ännu</p>
    {/each}

    <form method="POST" action="?/sendMessage" use:enhance>
      <Form.Field form={sendMessageForm} name="content">
        <Form.Control let:attrs>
          <Textarea
            {...attrs}
            placeholder="Skriv ett meddelande..."
            class="resize-y bg-card"
            bind:value={$formData.content}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <div class="flex justify-end">
        <FormSubmit
          {allErrors}
          {submitting}
          text="Skicka"
          loadingText={"Skickar..."}
        />
      </div>
    </form>
  {:else}
    <Title>Hittade ingen konversation</Title>
    <div class="flex justify-between">
      <span>Vill du gå tillbaka till ditt konto?</span>
      <Button on:click={() => goto("/")}>Konto</Button>
    </div>
  {/if}
</div>
