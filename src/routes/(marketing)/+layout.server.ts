import type { LayoutServerLoad } from "./$types";
import { getProfileBySession } from "~/lib/server/database/profile-model";

export const load: LayoutServerLoad = async ({
    locals: { supabase, getSession },
}) => {
    const session = await getSession();

    const profile = session ? await getProfileBySession(supabase, session) : null;

    return { session, profile };
};
