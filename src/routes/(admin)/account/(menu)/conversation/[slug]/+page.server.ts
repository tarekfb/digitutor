import { redirect, error, fail } from "@sveltejs/kit";
import { initMessagesCount, unknownErrorMessage } from "$lib/shared/constants/constants";
import { getMessages } from "$lib/server/database/messages";
import { sendMessageSchema, type InputMessage } from "$lib/shared/models/conversation";
import { getGenericFormMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { sendMessage } from "$lib/server/database/messages";

export const load = async ({ locals: { supabase }, params: { slug }, parent }) => {
  const { conversations } = await parent();

  const conversation = conversations.find((c) => c.id === slug);
  if (!conversation) {
    console.error("Conversation not found for slug: " + slug);
    throw error(404, {
      message: 'Not found'
    })
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
      throw redirect(303, "/sign-in");


    const form = await superValidate(event, zod(sendMessageSchema));
    if (!form.valid) return fail(400, { form });

    const inputMessage: InputMessage = {
      content: form.data.content,
      conversation: event.params.slug,
    }

    try {
      await sendMessage(supabase, inputMessage, session);
      return { form }
    } catch (error) {
      console.error(error);
      return message(form, getGenericFormMessage("destructive", "Kunde ej skicka meddelandet"), { status: 500 });
    }
  },
};
