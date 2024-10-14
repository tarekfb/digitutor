import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchSchema, } from "src/lib/shared/models/search";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getHighQualityReviews, getTopTeacherByReviews } from "src/lib/server/database/review";
import { formatDisplayProfile, type DisplayProfile, type Review } from "src/lib/shared/models/review";

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

    let displayReviews: Review[] = [];
    try {
        const reviews = await getHighQualityReviews(supabase, 4);
        displayReviews = reviews.filter(r => r.description && r.description.length > 15);
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