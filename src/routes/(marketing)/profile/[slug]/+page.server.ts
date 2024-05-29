import { error } from "@sveltejs/kit";
import { unknownErrorMessage } from "$lib/constants";
import { getProfileByUserId } from "src/lib/server/database/profiles";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
    let profile;
    try {
        profile = await getProfileByUserId(supabase, slug);
    } catch (e) {
        console.error("Error when reading profile with id: " + slug, e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    };
    if (!profile)
        throw error(404, {
            message: 'Not found'
        });

    return { profile };
}
