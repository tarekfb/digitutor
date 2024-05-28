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
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import ChatWindow from "src/lib/components/molecules/chat-window.svelte";

  export let data;
  const { profile, messages, conversation, supabase } = data;

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

  const receiver =
    profile.role == "teacher" ? conversation.student : conversation.teacher;
</script>

{#if conversation}
  <div class="flex flex-col justify-between gap-y-4 h-full">
    <div class="flex flex-col gap-y-4">
      <div class="flex gap-x-4 items-center">
        <Title>{receiver.first_name}</Title>
        <Button class="relative h-8 w-8 rounded-full">
          <Avatar.Root class="h-8 w-8 flex fy-center text-xs items-center ">
            <Avatar.Fallback class="text-background bg-primary"
              >{convertToInitials(
                receiver.first_name,
                receiver.last_name,
              )}</Avatar.Fallback
            >
          </Avatar.Root>
        </Button>
      </div>

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
    <Title>Hittade ingen konversation</Title>
    <div class="flex justify-between">
      <span>Vill du gå tillbaka till ditt konto?</span>
      <Button on:click={() => goto("/")}>Konto</Button>
    </div>
  </div>
{/if}
