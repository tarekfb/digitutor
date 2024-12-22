import { error } from "@sveltejs/kit";
import { defaultErrorInfo } from "$lib/shared/constants/constants";
import { sendMessageSchema, type ConversationWithReferences } from "$lib/shared/models/conversation";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getConversation } from "src/lib/server/database/conversations";
import { ExternalErrorCodes } from "src/lib/shared/models/common";
import { formatConversationWithReferences } from "src/lib/shared/utils/conversation/utils";
import { isErrorWithCode } from "src/lib/shared/utils/utils";

export const ssr = false;

export const load = async ({ locals: { supabase }, params: { slug }, parent }) => {
  const { profile } = await parent();

  let conversation: ConversationWithReferences;
  try {
    const { role, id } = profile;
    const dbConversation = await getConversation(supabase, slug, role, id);
    conversation = formatConversationWithReferences(dbConversation);
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
