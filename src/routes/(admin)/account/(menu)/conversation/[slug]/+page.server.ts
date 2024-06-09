import { redirect, error, fail } from "@sveltejs/kit";
import { initMessagesCount, unknownErrorMessage } from "$lib/constants";
import { getMessages } from "src/lib/server/database/messages";
import { getConversation } from "src/lib/server/database/conversations";
import { sendMessageSchema, type InputMessage } from "src/lib/models/conversations";
import { getGenericErrorMessage } from "$lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { sendMessage } from "src/lib/server/database/messages";

export const load = async ({ locals: { supabase, safeGetSession }, params: { slug } }) => {
  const { session } = await safeGetSession();
  if (!session)
    throw redirect(303, "/login");

  let conversation;
  try {
    conversation = await getConversation(supabase, slug);
  } catch (e) {
    console.error("Error when fetching conversation for slug: " + slug, e);
    throw error(500, {
      message: unknownErrorMessage,
    });
  };

  if (!conversation) {
    console.error("Conversation not found for slug: " + slug);
    throw error(404, {
      message: 'Not found'
    });
  }

  let messages;
  try {
    messages = await getMessages(supabase, conversation.id, initMessagesCount);
  } catch (e) {
    console.error("Error when fetching messages for slug: " + slug, e);
    throw error(500, {
      message: unknownErrorMessage,
    });
  };

  messages = await getMessages(supabase, conversation.id, initMessagesCount);
  if (!messages) {
    console.error("Messages not found for slug: " + slug);
    throw error(404, {
      message: 'Not found'
    });
  }

  const form = await superValidate(zod(sendMessageSchema))

  return { conversation, messages, form }; // todo stream messages and skeleton load them
}


export const actions = {
  sendMessage: async (event) => {
    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/login");

    const form = await superValidate(event, zod(sendMessageSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const inputMessage: InputMessage = {
      content: form.data.content,
      conversation: event.params.slug,
    }

    try {
      await sendMessage(supabase, inputMessage);
      return { form }
    } catch (error) {
      console.error(error);
      return message(form, getGenericErrorMessage("destructive", "Kunde ej skicka meddelandet"), { status: 500 });
    }
  },
};
