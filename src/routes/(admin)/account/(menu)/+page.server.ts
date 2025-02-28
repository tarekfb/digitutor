import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.ts";
import { defaultErrorInfo } from "$lib/shared/constants/constants.ts";
import { redirect } from "sveltekit-flash-message/server";
import { getConversations } from "src/lib/server/database/conversations.ts";
import type { ConversationWithReferences } from "src/lib/shared/models/conversation.ts";
import { formatConversationWithReferences } from "src/lib/shared/utils/conversation/utils.ts";

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
    conversations.sort((a, b) => {
      const aHasReplied = b.hasReplied ? 0 : 1;
      const bHasReplied = a.hasReplied ? 0 : 1;
      return aHasReplied - bHasReplied;
    });
  } catch (e) {
    console.error(e);
    error(500, { ...defaultErrorInfo });
  }

  const { profile } = await parent();

  return { conversations, profile };
};
