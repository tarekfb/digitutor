import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { defaultErrorInfo, defaultErrorTitle } from "$lib/shared/constants/constants";
import { redirect } from "sveltekit-flash-message/server";
import { getConversations } from "src/lib/server/database/conversations";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession }, parent,
}) => {
  const { session } = await safeGetSession();
  if (!session)
    throw redirect(303, "/sign-in");

  let conversations;
  try {
    conversations = await getConversations(supabase, session.user.id);
  } catch (e) {
    console.error(e);
    error(500, { ...defaultErrorInfo });
  }

  const { profile } = await parent();

  return { conversations, profile };
};