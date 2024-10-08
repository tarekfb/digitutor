import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getProfileByUser } from "$lib/server/database/profiles";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { user } = await safeGetSession();

  if (!user)
    redirect(303, "/sign-in");

  const profile = await getProfileByUser(supabase, user.id);
  return { profile };
};
