<script lang="ts">
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import FormMessage from "$lib/components/molecules/form-message.svelte";
  import AlertMessage from "$lib/components/atoms/alert-message.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import PrimaryTitle from "$lib/components/atoms/primary-title.svelte";
  import FormSubmit from "$lib/components/molecules/form-submit.svelte";
  import { invalidate } from "$app/navigation";
  import {
    sendMessageSchema,
    type Message,
  } from "src/lib/shared/models/conversation.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import ChatWindow from "$lib/components/molecules/chat-window.svelte";
  import { initChat, sendMessageToStore } from "src/stores/chat";
  import type { Tables } from "src/supabase.js";
  import type { PageData } from "./$types";
  import AvatarNameBar from "src/lib/components/organisms/avatar-name-bar.svelte";
  import { Button } from "src/lib/components/ui/button";
  import Avatar from "src/lib/components/atoms/avatar.svelte";
  import AccountLayout from "../../account-layout.svelte";
  import { SendHorizontal } from "lucide-svelte";
  import { Input } from "src/lib/components/ui/input";

  export let data: PageData;
  $: ({ profile: self, conversation, supabase, session } = data);

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
    delayed,
    message,
    allErrors,
    constraints,
  } = sendMessageForm;

  const getAllowedToReply = async (profile: Tables<"profiles">) => {
    const messages = await chatStore.load();
    if (profile.role === "teacher") return true; // always allow
    if (messages.length === 0) return true; // shouldn't happen but allow for error proofing
    if (messages.some((msg) => msg.sender !== profile.id)) return true; // has recieved reply
    return false;
  };

  $: chatStore = initChat(conversation.id, supabase, session);

  $: recipient =
    self.role == "teacher" ? conversation.student : conversation.teacher;

  let isAllowedToReply: boolean = true;

  // $: isAllowedToReply = getAllowedToReply(profile).then((allowed) => {
  //   isAllowedToReply = allowed;
  // });

  // $: chat.subscribe((messages) => {
  //   // if already allowed to reply - skip for performance reasons
  //   // also not interested on init execution
  //   if (!isAllowedToReply && messages.length > 0)
  //     isAllowedToReply = getAllowedToReply($chat, profile);
  //   if (
  //     profile.role === "teacher" &&
  //     !conversation.has_replied &&
  //     messages[messages.length - 1]?.sender === profile.id
  //   ) {
  //     invalidate("conversations:has_replied");
  //   }
  // });

  const sendMessage = async () => {
    const isAllowedToReply = await getAllowedToReply(self);
    if (!isAllowedToReply) {
      return toast.info(
        `När du fått svar från ${recipient.first_name} kan du skicka fler meddelanden`,
      );
    }
    const message = $formData.content;
    if (!message) return toast.info("Skriv ett meddelande först");

    if (!session)
      return toast.error(
        "Logga in först. Du kan kontakta oss om detta fortsätter.",
      );

    sendMessageToStore(chatStore, message, conversation.id, session);
    sendMessageForm.reset();
  };
</script>

<div
  class="mt-8 mx-8 my-8 flex flex-col justify-end flex-1 md:self-center md:w-full md:max-w-xl lg:max-w-2xl"
>
  <!-- <div class="my-8 flex flex-col items-center w-full md:max-w-xl lg:max-w-2xl"> -->
  <ChatWindow {chatStore} {self} other={recipient} />

  <!-- bg-accent md:bg-foreground  -->
  <form
    method="POST"
    use:enhance
    class="flex flex-col gap-y-2 px-4 justify-center -mx-8 fixed bottom-0 w-full h-20"
  >
    {#if !isAllowedToReply}
      <AlertMessage
        title="Väntar på svar"
        description={`Väntar på svar från ${recipient.first_name ?? "läraren"}. Du kan
          skicka fler meddelanden när du fått svar.`}
      />
    {/if}
    <FormMessage {message} class="mt-2" scroll />
    <div class="flex justify-between gap-x-2 items-center">
      <Input
        {...$constraints.content}
        placeholder="Skriv ett meddelande..."
        class="bg-card"
        bind:value={$formData.content}
        disabled={!isAllowedToReply}
      />
      <Button
        on:click={sendMessage}
        disabled={!isAllowedToReply || $allErrors.length > 0}
        ><SendHorizontal />
      </Button>
    </div>
  </form>
</div>
