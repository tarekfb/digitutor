import { getListings } from "$lib/server/database/listings";
import type { LayoutServerLoad } from "./$types";
import { getProfileByUser } from "$lib/server/database/profiles";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession }, depends,
}) => {
  depends("supabase:auth");
  const { session, user } = await safeGetSession()
  const profile = session && await getProfileByUser(supabase, user.id);
  const listings = await getListings(supabase, 5, undefined, true);

  return { session, profile, listings }; // TODO: stream these
};