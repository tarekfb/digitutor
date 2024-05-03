import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "src/supabase";

export const getProfileBySession = async (supabase: SupabaseClient<Database>, session: Session) => {
    const id = session.user.id;
    const { data: profile } = await getProfileByUserId(supabase, id);
    return profile;
};

export const getProfileByUserId = async (supabase: SupabaseClient<Database>, userId: string) => {
    return await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", userId)
        .single();

}

