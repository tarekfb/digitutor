import { getListings } from "$lib/server/database/listings";
import type { LayoutServerLoad } from "./$types";
import { getProfileByUser } from "$lib/server/database/profiles";
import { formatProfile } from "src/lib/shared/utils/profile/utils";
import type { ListingWithProfile } from "src/lib/shared/models/listing";
import { formatListingWithProfile } from "src/lib/shared/utils/listing/utils";
import type { Profile } from "src/lib/shared/models/profile";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession }, depends,
}) => {
  depends("supabase:auth");
  const { session, user } = await safeGetSession()
  
  let profile: Profile | undefined;
  try {
    const dbProfile = session && await getProfileByUser(supabase, user.id);
    profile = dbProfile ? formatProfile(dbProfile) : undefined;
  } catch (error) {
    console.error("Unable to get profile in (marketing) layout", error);
  }

  let listings: ListingWithProfile[] = [];
  try {
    const dbListings = await getListings(supabase, 5, undefined, true);
    listings = dbListings.map(listing => formatListingWithProfile(listing));
  } catch (error) {
    console.error("Unable to get listings in (marketing) layout", error);
  }

  return { session, profile, listings }; // TODO: stream these
};