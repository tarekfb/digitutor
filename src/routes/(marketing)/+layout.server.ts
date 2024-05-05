import { getListings } from "$lib/server/database/listings";
import type { LayoutServerLoad } from "./$types";
import { getProfileBySession } from "$lib/server/database/profiles";

export const load: LayoutServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  const session = await getSession();
  const profile = session && await getProfileBySession(supabase, session);
  const listings = await getListings(supabase, 5);

  return { session, profile, listings }; // TODO: stream these
};
