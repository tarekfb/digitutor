import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getTopTeacherByReviews } from "src/lib/server/database/review";
import { formatDisplayProfile, type DisplayProfile } from "src/lib/shared/models/review";

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

    return { form, displayProfiles };
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