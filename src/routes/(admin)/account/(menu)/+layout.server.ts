import type { LayoutServerLoad } from "./$types";
import { getConversations } from "$lib/server/database/conversations";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
  const { locals: { supabase, safeGetSession }, depends } = event;
  depends("conversations:has_replied");

  const { session } = await safeGetSession();
  if (!session) {
    throw redirect(303, "/auth");
  }

  const { profile } = await event.parent();
  const conversations = await getConversations(supabase, session.user.id);

  return { profile, conversations };
};
