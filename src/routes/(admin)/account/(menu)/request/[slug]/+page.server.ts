import { error } from "@sveltejs/kit";
import { defaultErrorInfo } from "$lib/shared/constants/constants";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { ExternalErrorCodes } from "src/lib/shared/models/common";
import { isErrorWithCode } from "src/lib/shared/utils/utils";
import { getConversationRequest } from "src/lib/server/database/conversation-requests.js";
import { formatConversationRequestWithReferences } from "src/lib/shared/utils/request-conversation/utils.js";
import { sendRequestMessageSchema, type ConversationRequestWithReferences } from "src/lib/shared/models/conversation-request.js";

export const ssr = false;

export const load = async ({
  locals: { supabase },
  params: { slug },
  parent,
}) => {
  const { profile } = await parent();

  let request: ConversationRequestWithReferences;
  try {
    const { role, id } = profile;
    const dbRequest = await getConversationRequest(supabase, slug, role, id);
    request = formatConversationRequestWithReferences(dbRequest);
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === ExternalErrorCodes.InvalidInputSyntax)
        error(404, {
          message: "Vi kunde inte hitta konversationen",
          description:
            "Konversationen finns inte eller har tagits bort. Du kan kontakta oss om detta fortsätter.",
        });

      if (e.code === ExternalErrorCodes.ContainsZeroRows)
        error(404, {
          message: "Vi kunde inte hitta konversationen",
          description: "Konversationen finns inte eller har tagits bort.",
        });
    }
    console.error("Unable to find conversation request for slug " + slug, e);
    error(500, { ...defaultErrorInfo });
  }

  const form = await superValidate(zod(sendRequestMessageSchema));

  return { request, form };
};
