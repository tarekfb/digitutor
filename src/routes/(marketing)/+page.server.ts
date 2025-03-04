import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema } from "src/lib/shared/models/search.ts";
import type { PageServerLoad } from "./$types.ts";
import {
  getHighQualityReviews,
} from "src/lib/server/database/review.ts";
import {
  type ReviewWithReferences,
} from "src/lib/shared/models/review.ts";
import { formatReviewWithReferences } from "src/lib/shared/utils/reviews/utils.ts";
import { formatSubject, type Subject } from "src/lib/shared/models/subject.ts";
import { languages } from "src/lib/shared/models/common.ts";
import { getSubjects } from "src/lib/server/database/subjects.ts";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const searchForm = await superValidate(zod(searchSchema));

  // todo: not used or tested atm, but must bring back.
  // let displayProfiles: DisplayProfile[] = [];
  // try {
  //   const unformatted = await getTopTeacherByReviews(supabase, 5);
  //   displayProfiles = unformatted.map((r) => formatDisplayProfile(r));
  //   displayProfiles = displayProfiles.filter(
  //     (r) => r.avgRating > 0 && r.avatarUrl,
  //   );
  //   if (displayProfiles.length > 4)
  //     displayProfiles = displayProfiles.slice(0, 4);
  // } catch (e) {
  //   console.error("Error when fetching top teacher by reviews", e);
  //   displayProfiles = [];
  // }

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

  return { searchForm, displayReviews };
}