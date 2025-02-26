import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types.ts";
import { getProfileByUser } from "$lib/server/database/profiles.ts";
import type { Profile } from "src/lib/shared/models/profile.ts";
import { getDefaultErrorInfoObjectified } from "src/lib/shared/constants/constants.ts";
import { formatProfile } from "src/lib/shared/utils/profile/utils.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { user } = await safeGetSession();

  if (!user) redirect(303, "/sign-in");

  let profile: Profile;
  try {
    const dbProfile = await getProfileByUser(supabase, user.id);
    profile = formatProfile(dbProfile);
  } catch (e) {
    const trackingId = logError({error: e, 
      message: "Error while fetching profile in layout for account",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }
  return { profile };
};
