<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import Avatar from "$lib/components/atoms/avatar.svelte";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import { goto, invalidate } from "$app/navigation";
  import { sendMessageSchema } from "src/lib/shared/models/conversation.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import ChatWindow from "$lib/components/molecules/chat-window.svelte";
  import { chat } from "src/stores/chat";
  import type { Tables } from "src/supabase.js";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ profile, messages, conversation, supabase } = data);

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

  const getAllowedToReply = (
    msgs: Tables<"messages">[],
    profile: Tables<"profiles">,
  ) => {
    if (profile.role === "teacher") return true; // always allow
    if (msgs.length === 0) return true; // shouldn't happen but allow for error proofing
    if (msgs.some((msg) => msg.sender !== profile.id)) return true; // has recieved reply
    return false;
  };

  $: recipient =
    profile.role == "teacher" ? conversation.student : conversation.teacher;
  $: isAllowedToReply = getAllowedToReply(messages, profile);
  $: chat.subscribe((messages) => {
    // if already allowed to reply - skip for performance reasons
    // also not interested on init execution
    if (!isAllowedToReply && messages.length > 0)
      isAllowedToReply = getAllowedToReply($chat, profile);
    if (
      profile.role === "teacher" &&
      !conversation.has_replied &&
      messages[messages.length - 1]?.sender === profile.id
    ) {
      invalidate("conversations:has_replied");
    }
  });
</script>

{#if conversation}
  <div class="flex flex-col justify-between gap-y-4 h-full">
    <div class="flex flex-col gap-y-4">
      <div class="flex gap-x-4">
        <Button class="relative h-8 w-8 rounded-full">
          <Avatar
            onClick={() => goto(`/profile/${recipient.id}`)}
            profile={recipient}
          />
        </Button>
        <PrimaryTitle>{recipient.first_name}</PrimaryTitle>
      </div>
      <Separator />
      <ChatWindow
        {supabase}
        {profile}
        {messages}
        receiver={recipient}
        conversationId={conversation.id}
      />
      <Separator />
    </div>

    <form
      method="POST"
      action="?/sendMessage"
      use:enhance
      class="flex flex-col gap-y-2"
    >
      {#if !isAllowedToReply}
        <Alert.Root class="bg-card text-center">
          <Alert.Title>Väntar på svar</Alert.Title>
          <Alert.Description
            >{`Väntar på svar från ${recipient.first_name ?? "läraren"}. Du kan
          skicka fler meddelanden när du fått svar.`}</Alert.Description
          >
        </Alert.Root>
      {/if}
      <FormMessage {message} class="mt-2" scroll />
      <Form.Field form={sendMessageForm} name="content">
        <Form.Control let:attrs>
          <Textarea
            {...attrs}
            placeholder="Skriv ett meddelande..."
            class="resize-y bg-card"
            bind:value={$formData.content}
            disabled={!isAllowedToReply}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <div class="flex justify-end">
        <FormSubmit
          {allErrors}
          {submitting}
          text="Skicka"
          disabled={!isAllowedToReply}
          loadingText="Skickar..."
        />
      </div>
    </form>
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
