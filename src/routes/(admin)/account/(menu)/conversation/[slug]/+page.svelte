<script lang="ts">
  import { toast, Toaster } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { sendMessageSchema } from "src/lib/shared/models/conversation.js";
  import ChatWindow from "$lib/components/molecules/chat-window.svelte";
  import { initChat, sendMessageToStore } from "src/stores/chat";
  import type { Tables } from "src/supabase.js";
  import type { PageData } from "./$types";
  import { Button } from "src/lib/components/ui/button";
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
  const { form: formData, enhance, allErrors, constraints } = sendMessageForm;

  $: chatStore = initChat(conversation.id, supabase, session);

  $: recipient =
    self.role == "teacher" ? conversation.student : conversation.teacher;

  const getAllowedToReply = async (profile: Tables<"profiles">) => {
    const messages = await chatStore.load();
    if (profile.role === "teacher") return true; // always allow
    if (messages.length === 0) return true; // shouldn't happen but allow for error proofing
    if (messages.some((msg) => msg.sender !== profile.id)) return true; // has recieved reply
    return false;
  };

  const sendMessage = async () => {
    let isAllowedToReply = true;
    try {
      isAllowedToReply = await getAllowedToReply(self);
    } catch {
      isAllowedToReply = true;
    }

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

    toast.info("test", )
  };
</script>

<div
  class="mx-8 my-8 flex flex-col justify-end flex-1 md:self-center md:w-full md:max-w-xl lg:max-w-2xl"
>
  <ChatWindow {chatStore} {self} other={recipient} />

  <form
    method="POST"
    use:enhance
    class="flex flex-col gap-y-2 px-4 justify-center -mx-8 fixed bottom-0 w-full md:self-center md:w-2/4 h-20"
  >
    <div class="flex justify-between gap-x-2 items-center">
      <Input
        {...$constraints.content}
        placeholder="Skriv ett meddelande..."
        class="bg-card"
        bind:value={$formData.content}
      />
      <Button
        on:click={sendMessage}
        disabled={$allErrors.length > 0}
        aria-label="Skicka meddelande"
        ><SendHorizontal />
      </Button>
    </div>
  </form>
</div>
