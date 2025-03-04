import { getListings } from "$lib/server/database/listings.ts";
import type { LayoutServerLoad } from "./$types.ts";
import { getProfileByUser } from "$lib/server/database/profiles.ts";
import { formatProfile } from "src/lib/shared/utils/profile/utils.ts";
import type { ListingWithProfile } from "src/lib/shared/models/listing.ts";
import { formatListingWithProfile } from "src/lib/shared/utils/listing/utils.ts";
import type { Profile } from "src/lib/shared/models/profile.ts";
import { searchSchema } from "src/lib/shared/models/search.ts";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getSubjects } from "src/lib/server/database/subjects.ts";
import { languages } from "src/lib/shared/models/common.ts";
import { type Subject, formatSubject } from "src/lib/shared/models/subject.ts";

export const load: LayoutServerLoad = async ({
  locals: { supabase, safeGetSession },
  depends,
}) => {
  depends("supabase:auth");
  const { session, user } = await safeGetSession();

  let profile: Profile | undefined;
  if (session && user)
    try {
      const dbProfile = session && (await getProfileByUser(supabase, user.id));
      profile = dbProfile ? formatProfile(dbProfile) : undefined;
    } catch (error) {
      console.error("Unable to get profile in (marketing) layout", error);
    }

  let listings: ListingWithProfile[] = [];
  try {
    const dbListings = await getListings(supabase, 5, undefined, true);
    listings = dbListings.map((listing) => formatListingWithProfile(listing));
  } catch (error) {
    console.error("Unable to get listings in (marketing) layout", error);
  }

  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map((s) => formatSubject(s));
  } catch (e) {
    console.error("Unknown error when reading subjects", e);
    subjects = languages;
  }

  const searchForm = await superValidate(zod(searchSchema));

  return { session, profile, listings, searchForm, subjects }; // TODO: stream these
};
