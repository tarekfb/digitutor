import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getTopTeacherByReviews } from "src/lib/server/database/review";
import { formatDisplayReview, type DisplayReview } from "src/lib/shared/models/review";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const form = await superValidate(zod(searchSchema))

    let displayReviews: DisplayReview[] = [];
    try {
        const unformatted = await getTopTeacherByReviews(supabase, 5);
        displayReviews = unformatted.map(r => formatDisplayReview(r));
        // displayReviews = displayReviews.filter(r => r.avgRating > 0 && r.avatarUrl);
        displayReviews = displayReviews.filter(r => r.avgRating > 0);
        displayReviews = displayReviews.map(r => {
            return {
                ...r,
                subjects: [...r.subjects, 5, 6, 7, 8, 10, 12],
            }
        });
        if (displayReviews.length > 4) displayReviews = displayReviews.slice(0, 4);
    }
    catch (e) {
        console.error("Error when fetching top teacher by reviews", e);
        displayReviews = [];
    }


    // also get some good reviews
    // let review;
    // try {
    //     const reviews = await getHighQualityReviews(supabase, 1);
    //     const longReviews = reviews.filter(r => r.description && r.description.length > 15);
    //     review = longReviews[0] ?? reviews[0];
    // } catch (e) {
    //     console.error("Error when reviews signup display, perhaps didnt find valid review", e);
    //     error(500, {
    //         message: unknownErrorTitle,
    //     });
    // };

    return { form, displayReviews };
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