import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "src/supabase";

export const getProfileBySession = async (
  supabase: SupabaseClient<Database>,
  session: Session,
) => {
  const id = session.user.id;
  const profile = await getProfileByUserId(supabase, id);
  return profile;
};

export const getProfileByUserId = async (
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<Tables<"profiles">> => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", userId)
    .single();

  if (error) {
    console.log(`Failed to get profile for userId: ${userId}*`, { error });
    throw error;
  }

  return data;
};
