import type { LayoutServerLoad } from "./$types";
import { getConversations } from "src/lib/server/database/conversations";

export const load: LayoutServerLoad = async (parentData) => {
  const { locals: { supabase } } = parentData;
  const { profile, session } = await parentData.parent();
  const conversations = await getConversations(supabase, session.user.id);

  return { session, profile, conversations };
};
