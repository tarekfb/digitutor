import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getProfileBySession } from "$lib/server/database/profiles";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();

  if (!session)
    throw redirect(303, "/auth");

  const profile = await getProfileBySession(supabase, session);
  return { profile };
};
