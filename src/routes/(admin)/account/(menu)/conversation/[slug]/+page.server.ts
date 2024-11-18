import { redirect, error, fail } from "@sveltejs/kit";
import { defaultErrorInfo, initMessagesCount, defaultErrorTitle } from "$lib/shared/constants/constants";
import { getMessages } from "$lib/server/database/messages";
import { sendMessageSchema, type InputMessage } from "$lib/shared/models/conversation";
import { getFailFormMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { sendMessage } from "$lib/server/database/messages";
import { getConversation } from "src/lib/server/database/conversations";
import { ExternalErrorCodes } from "src/lib/shared/models/common";
import { isErrorWithCode } from "src/lib/shared/utils/utils";

export const ssr = false;

export const load = async ({ locals: { supabase }, params: { slug }, parent }) => {
  const { profile } = await parent();

  let conversation;
  try {
    conversation = await getConversation(supabase, slug, profile);
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === ExternalErrorCodes.InvalidInputSyntax)
        error(404, {
          message: "Vi kunde inte hitta konversationen",
          description: "Konversationen finns inte eller har tagits bort. Du kan kontakta oss om detta fortsätter."
        });

      if (e.code === ExternalErrorCodes.ContainsZeroRows)
        error(404, {
          message: "Vi kunde inte hitta konversationen",
          description: "Konversationen finns inte eller har tagits bort."
        });
    }
    console.error("Unable to find conversation for slug " + slug, e);
    error(500, { ...defaultErrorInfo });
  }

  const form = await superValidate(zod(sendMessageSchema))

  return { conversation, form };
}
