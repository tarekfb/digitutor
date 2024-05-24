<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Form from "$lib/components/ui/form/index.js";
  import { convertToInitials } from "src/lib/utils.js";
  import Title from "src/lib/components/atoms/title.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { goto } from "$app/navigation";
  import { sendMessageSchema } from "src/lib/models/conversations";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  export let data;
  const { profile, messages, form } = data;
  const conversation = data.conversation;
  const receiver =
    profile.role == "teacher" ? conversation.student : conversation.teacher;

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
    <div class="flex gap-x-4 items-center">
      <Title>{receiver.first_name}</Title>
      <Button class="relative h-8 w-8 rounded-full">
        <Avatar.Root class="h-8 w-8 flex justify-center text-xs items-center ">
          <Avatar.Fallback class="text-background bg-primary"
            >{convertToInitials(
              receiver.first_name,
              receiver.last_name,
            )}</Avatar.Fallback
          >
        </Avatar.Root>
      </Button>
    </div>

    {#each messages as message}
      <div
        class="flex flex-col gap-y-2 bg-card p-2 rounded-md {message.sender ===
        profile.id
          ? 'self-end'
          : 'self-start'}"
      >
        <h3 class="font-semibold">
          {message.sender === profile.id ? "Du" : receiver.first_name}
        </h3>
        <p>{message.content}</p>
        <p class="text-sm text-muted-foreground">
          {message.created_at.substring(0, 10)}
        </p>
      </div>
    {:else}
      <p>Inga meddelanden ännu</p>
    {/each}

    <form
      method="POST"
      action="?/sendMessage"
      use:enhance
      class="flex flex-col gap-y-2"
    >
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
          loadingText="Skickar..."
        />
      </div>
      <FormMessage {message} class="mt-2" />
    </form>
  {:else}
    <Title>Hittade ingen konversation</Title>
    <div class="flex justify-between">
      <span>Vill du gå tillbaka till ditt konto?</span>
      <Button on:click={() => goto("/")}>Konto</Button>
    </div>
  {/if}
</div>
