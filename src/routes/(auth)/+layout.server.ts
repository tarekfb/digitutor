import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { getProfileByUser } from "src/lib/server/database/profiles";

export const ssr = true;

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
    // depends("supabase:auth");
    const { session, user } = await safeGetSession()
    if (session)
        throw redirect(303, "/account");

    const profile = session && await getProfileByUser(supabase, user.id);
    return { profile }
}


// export const load: LayoutServerLoad = async ({
//     locals: { supabase, safeGetSession }, depends,
// }) => {


//     return { session, profile, listings }; // TODO: stream these
// };