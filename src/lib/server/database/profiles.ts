import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { CreateProfileInput } from "src/lib/models/user";
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
    console.log(`Failed to get profile for userId: ${userId}`, { error });
    throw error;
  }

  return data;
};


export const createProfile = async (
  supabase: SupabaseClient<Database>,
  userInput: CreateProfileInput,
): Promise<Tables<"profiles">> => {

  const dbProfile: Tables<"profiles"> = {
    id: userInput.userId,
    role: userInput.role,
    created_at: new Date().toDateString(),
    updated_at: null,
    avatar_url: null,
    first_name: userInput.firstName,
    last_name: userInput.lastName,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(dbProfile)
    .select(`*`)
    .limit(1)
    .single();
  if (error) {
    console.log(`Failed to create profile for userId: ${userInput.userId}`, { error });
    throw error;
  }
  return data;
}