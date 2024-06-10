<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import FormMessage from "src/lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  import PrimaryTitle from "src/lib/components/atoms/primary-title.svelte";
  import FormSubmit from "src/lib/components/molecules/form-submit.svelte";
  import { goto } from "$app/navigation";
  import { sendMessageSchema } from "src/lib/models/conversations";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import ChatWindow from "src/lib/components/molecules/chat-window.svelte";

  export let data;
  $: ({ profile, messages, conversation, supabase } = data);
  $: receiver =
    profile.role == "teacher" ? conversation.student : conversation.teacher;

  const sendMessageForm = superForm(data.form, {
    validators: zodClient(sendMessageSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
    invalidateAll: false,
  });
  const {
    form: formData,
    enhance,
    submitting,
    message,
    allErrors,
  } = sendMessageForm;
</script>

{#if conversation}
  <div class="flex flex-col justify-between gap-y-4 h-full">
    <div class="flex flex-col gap-y-4">
      <div class="flex gap-x-4 justify-between">
        <PrimaryTitle>{receiver.first_name}</PrimaryTitle>
        <Button class="relative h-8 w-8 rounded-full">
          <Avatar
            onClick={() => goto(`/profile/${receiver.id}`)}
            profile={receiver}
          />
        </Button>
      </div>
      <Separator />
      <ChatWindow
        {supabase}
        {profile}
        {messages}
        {receiver}
        conversationId={conversation.id}
      />

      <Separator />
    </div>

    <div class="flex flex-col gap-y-4">
      <FormMessage {message} class="mt-2" scroll />
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
      </form>
    </div>
  </div>
{:else}
  <div class="flex flex-col gap-y-4">
    <PrimaryTitle>Hittade ingen konversation</PrimaryTitle>
    <div class="flex justify-between">
      <span>Vill du gå tillbaka till ditt konto?</span>
      <Button on:click={() => goto("/")}>Konto</Button>
    </div>
  </div>
{/if}
