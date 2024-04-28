import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getProfileBySession } from "~/lib/server/database/profile-model";

export const load: LayoutServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, "/login");
  }

  const profile = await getProfileBySession(supabase, session);

  return { session, profile };
};
