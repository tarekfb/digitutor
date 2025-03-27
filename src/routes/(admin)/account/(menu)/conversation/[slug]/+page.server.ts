import { error } from "@sveltejs/kit";
import { getDefaultErrorInfo } from "$lib/shared/constants/constants.ts";
import {
  sendMessageSchema,
  type ConversationWithReferences,
} from "$lib/shared/models/conversation.ts";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getConversation } from "src/lib/server/database/conversations.ts";
import { ExternalErrorCodes } from "src/lib/shared/models/common.ts";
import { formatConversationWithReferences } from "src/lib/shared/utils/conversation/utils.ts";
import { isErrorWithCode } from "src/lib/shared/utils/utils.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

export const ssr = false;

export const load = async ({
  locals: { supabase },
  params: { slug },
  parent,
}) => {
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
          description:
            "Det verkar som att konversationen du söker inte är tillgänglig. Det kan bero på att du inte är inloggad, att den tagits bort, eller att adressen är felaktig.",
        });

      if (e.code === ExternalErrorCodes.ContainsZeroRows)
        error(404, {
          message: "Vi kunde inte hitta konversationen",
          description: "Konversationen finns inte eller har tagits bort.",
        });
    }
    const trackingId = logErrorServer({
      error: e,
      message: "Error when retrieving conversation with slug " + slug,
    });
    error(500, { ...getDefaultErrorInfo({ trackingId }) });
  }

  const form = await superValidate(zod(sendMessageSchema));

  return { conversation, form };
};
