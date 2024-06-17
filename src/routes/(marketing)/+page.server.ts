import { error } from "@sveltejs/kit";
import { unknownErrorMessage } from "$lib/shared/constants/constants";
import { redirect } from "sveltekit-flash-message/server";

export const actions = {
    signout: async ({ locals: { supabase, safeGetSession }, cookies }) => {
        const { session } = await safeGetSession();
        if (!session)
            redirect(303, "/auth");

        const { error: e } = await supabase.auth.signOut();
        if (e) {
            console.error('Unknown error on signout', e);
            error(500, unknownErrorMessage);
        }

        throw redirect(303, "/", { message: 'Du har loggats ut.', type: 'success' }, cookies);
    },
}