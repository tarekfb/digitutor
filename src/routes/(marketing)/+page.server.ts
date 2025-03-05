import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema } from "src/lib/shared/models/search.ts";
import type { PageServerLoad } from "./$types.ts";
import {
  getHighQualityReviews,
  getTopTeacher,
} from "src/lib/server/database/review.ts";
import {
  type ReviewWithReferences,
  type TopTeacher,
} from "src/lib/shared/models/review.ts";
import { formatReviewWithReferences, formatTopTeacher } from "src/lib/shared/utils/reviews/utils.ts";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const searchForm = await superValidate(zod(searchSchema));

  let displayProfiles: TopTeacher[] = [];
  try {
    const dbDisplayProfiles = await getTopTeacher(supabase, 5, false);
    displayProfiles = dbDisplayProfiles.map((r) => formatTopTeacher(r));
    displayProfiles = displayProfiles.filter(
      (r) => r.avatarUrl,
    );
    if (displayProfiles.length > 4)
      displayProfiles = displayProfiles.slice(0, 4);
  } catch (e) {
    console.error("Error when fetching top teacher by reviews", e);
    displayProfiles = [];
  }

  console.log(displayProfiles)

  let displayReviews: ReviewWithReferences[] = [];
  try {
    const dbReviews = await getHighQualityReviews(supabase, 8);
    const dbDisplayReviews = dbReviews.filter(
      (r) => r.description && r.description.length > 15,
    );
    displayReviews = dbDisplayReviews.map((review) =>
      formatReviewWithReferences(review),
    );
  } catch (e) {
    console.error("Error when fetching display reviews", e);
    displayReviews = [];
  }

  return { searchForm, displayReviews, displayProfiles };
}