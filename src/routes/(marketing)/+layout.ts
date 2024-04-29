import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { Tables } from "~/DatabaseDefinitions.js";

export const load = async ({ fetch, data, depends }) => {
    depends("supabase:auth");

    const supabase = createSupabaseLoadClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
    });

    const {
        data: { session }
    } = await supabase.auth.getSession();

    const profile: Tables<'profiles'> | null =
        data.profile;

    return { supabase, session, profile };
};

export const _hasFullProfile = (
    profile: Tables<'profiles'> | null,
) => {
    if (!profile) {
        return false;
    }
    if (!profile.full_name) {
        return false;
    }
    if (!profile.company_name) {
        return false;
    }
    if (!profile.website) {
        return false;
    }

    return true;
};
