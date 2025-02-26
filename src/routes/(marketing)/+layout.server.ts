import type { LayoutServerLoad } from "./$types.ts";
import { getProfileByUser } from "$lib/server/database/profiles.ts";
import { formatProfile } from "src/lib/shared/utils/profile/utils.ts";
import type { Profile } from "src/lib/shared/models/profile.ts";
import { logError } from "src/lib/shared/utils/logging/utils.ts";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
  depends,
}) => {
  depends("supabase:auth");
  const { session, user } = await safeGetSession();

  let profile: Profile | undefined;
  if (session && user) {
    try {
      const dbProfile = session && (await getProfileByUser(supabase, user.id));
      profile = dbProfile ? formatProfile(dbProfile) : undefined;
    } catch (error) {
      logError({
        error,
        message: "Unable to get profile in (marketing) layout",
      });
    }
  }

  return { session, profile };
};
