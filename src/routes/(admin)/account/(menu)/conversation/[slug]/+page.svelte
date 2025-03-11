<script lang="ts">
  import { toast } from "svelte-sonner";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { superForm } from "sveltekit-superforms";
  import { sendMessageSchema } from "src/lib/shared/models/conversation.js";
  import ChatWindow from "$lib/components/molecules/chat-window.svelte";
  import { initChat, sendMessageToStore } from "src/stores/chat.ts";
  import type { PageData } from "./$types.ts";
  import { Button } from "src/lib/components/ui/button/index.js";
  import SendHorizontal from "lucide-svelte/icons/send-horizontal";
  import { Input } from "src/lib/components/ui/input/index.js";
  import type { Profile } from "src/lib/shared/models/profile.ts";
  import { websiteName } from "src/lib/shared/constants/constants.ts";
  import { ZodError } from "zod";
  import Container from "src/lib/components/templates/Container.svelte";

  export let data: PageData;
  $: ({ profile: self, conversation, supabase, session } = data);

  const sendMessageForm = superForm(data.form, {
    validators: zodClient(sendMessageSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    },
    invalidateAll: false,
  });
  const { form, allErrors } = sendMessageForm;

  $: chatStore = initChat(conversation.id, supabase, session);

  $: recipient =
    self.role == "teacher" ? conversation.student : conversation.teacher;

  const getAllowedToReply = async (profile: Profile) => {
    const messages = await chatStore.load();
    if (profile.role === "teacher") return true; // always allow
    if (messages.length === 0) return true; // shouldn't happen but allow for error proofing
    if (messages.some((msg) => msg.sender !== profile.id)) return true; // has recieved reply
    return false;
  };

  const sendMessage = async () => {
    if (!session)
      return toast.error(
        "Logga in först. Du kan kontakta oss om detta fortsätter.",
      );

    let isAllowedToReply = true;
    try {
      isAllowedToReply = await getAllowedToReply(self);
    } catch {
      isAllowedToReply = true;
    }

    if (!isAllowedToReply)
      return toast.info(
        `När du fått svar från ${recipient.firstName} kan du skicka fler meddelanden.`,
      );

    const message = $form.content;
    if (!message) return toast.info("Skriv ett meddelande först");

    try {
      sendMessageSchema.parse({ content: message });
    } catch (error) {
      if (error instanceof ZodError) {
        if (error?.issues?.[0]?.message)
          return toast.info(error.issues[0].message);
      }
    }

    sendMessageToStore(chatStore, message, conversation.id, session);
    sendMessageForm.reset();
  };
</script>

<svelte:head>
  <title>{websiteName} | Konversation</title>
</svelte:head>

<Container
  class="w-full flex-1 justify-end self-center "
  padding
  margin
  maxWidth
  minWidth
>
  <ChatWindow {chatStore} {self} other={recipient} />

  <form
    class="fixed bottom-0 h-20 w-full max-w-full px-4 md:max-w-screen-sm md:px-8 lg:max-w-screen-md"
  >
    <div class="flex w-full items-center justify-between gap-x-2">
      <Input
        placeholder="Skriv ett meddelande..."
        class="w-full bg-card"
        bind:value={$form.content}
      />
      <Button
        on:click={sendMessage}
        type="submit"
        disabled={$allErrors.length > 0 || !$form.content}
        aria-label="Skicka meddelande"
        ><SendHorizontal />
      </Button>
    </div>
  </form>
</Container>
