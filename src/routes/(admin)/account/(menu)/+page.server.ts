import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.ts";
import { defaultErrorInfo, getDefaultErrorInfoObjectified } from "$lib/shared/constants/constants.ts";
import { redirect } from "sveltekit-flash-message/server";
import { getConversations } from "src/lib/server/database/conversations.ts";
import type { ConversationWithReferences } from "src/lib/shared/models/conversation.ts";
import { formatConversationWithReferences } from "src/lib/shared/utils/conversation/utils.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
  parent,
}) => {
  const { session } = await safeGetSession();
  if (!session) throw redirect(303, "/sign-in");

  let conversations: ConversationWithReferences[];
  try {
    const dbConversations = await getConversations(supabase, session.user.id);
    conversations = dbConversations.map((c) =>
      formatConversationWithReferences(c),
    );
  } catch (e) {
    const trackingId = logError({
      error: e,
      message: `Error while getting conversations ${session.user.id}`,
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }
  const { profile } = await parent();
  return { conversations, profile };
};
