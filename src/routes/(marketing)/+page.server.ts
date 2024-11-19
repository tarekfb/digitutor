import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getHighQualityReviews, getTopTeacherByReviews } from "src/lib/server/database/review";
import { type DisplayProfile, type ReviewWithReferences } from "src/lib/shared/models/review";
import { formatDisplayProfile } from "src/lib/shared/utils/profile/utils";
import { formatReviewWithReferences } from "src/lib/shared/utils/reviews/utils";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const form = await superValidate(zod(searchSchema))

    let displayProfiles: DisplayProfile[] = [];
    try {
        const unformatted = await getTopTeacherByReviews(supabase, 5);
        displayProfiles = unformatted.map(r => formatDisplayProfile(r));
        displayProfiles = displayProfiles.filter(r => r.avgRating > 0 && r.avatarUrl);
        if (displayProfiles.length > 4) displayProfiles = displayProfiles.slice(0, 4);
    }
    catch (e) {
        console.error("Error when fetching top teacher by reviews", e);
        displayProfiles = [];
    }

    let displayReviews: ReviewWithReferences[] = [];
    try {

        const dbReviews = await getHighQualityReviews(supabase, 4);
        const dbDisplayReviews = dbReviews.filter(r => r.description && r.description.length > 15);
        displayReviews = dbDisplayReviews.map(review => formatReviewWithReferences(review));
    } catch (e) {
        console.error("Error when fetching display reviews", e);
        displayReviews = [];
    };

    return { form, displayProfiles, displayReviews };
}

export const actions: Actions = {
    search: async (event) => {
        const form = await superValidate(event, zod(searchSchema));
        if (!form.valid) return fail(400, { form });
        const { query } = form.data;
        const cleanedQuery = query.trim();
        redirect(302, `/search/?q=${cleanedQuery}`);
    }
}