import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getProfileByUser } from "$lib/server/database/profiles";
import type { Profile } from "src/lib/shared/models/profile";
import { defaultErrorInfo } from "src/lib/shared/constants/constants";
import { formatProfile } from "src/lib/shared/utils/profile/utils";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { user } = await safeGetSession();

  if (!user)
    redirect(303, "/sign-in");

  let profile: Profile;
  try {
    const dbProfile = await getProfileByUser(supabase, user.id);
    profile = formatProfile(dbProfile);
  } catch (e) {
    console.error("Error while fetching profile in layout for account", e);
    error(500, { ...defaultErrorInfo });
  }
  return { profile };
};
