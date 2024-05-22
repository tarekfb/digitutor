import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { CreateProfile, CompleteProfileInput } from "src/lib/models/user";
import { getNow } from "src/lib/utils";
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
    console.error(`Failed to get profile for userId: ${userId}`, { error });
    throw error;
  }

  return data;
};


export const createProfile = async (
  supabase: SupabaseClient<Database>,
  profileInput: CreateProfile,
): Promise<Tables<"profiles">> => {

  const dbProfile: Tables<"profiles"> = {
    id: profileInput.id,
    role: profileInput.role,
    created_at: getNow(),
    updated_at: null,
    avatar_url: null,
    first_name: profileInput.firstName,
    last_name: profileInput.lastName,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(dbProfile)
    .select(`*`)
    .limit(1)
    .single();
  if (error) {
    console.error(`Failed to create profile for userId: ${profileInput.id}`, { error });
    throw error;
  }
  return data;
}

export const updateProfile = async (
  supabase: SupabaseClient<Database>,
  profileInput: Tables<"profiles">,
): Promise<Tables<"profiles">> => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profileInput)
    .select(`*`)
    .limit(1)
    .single();
  if (error) {
    console.error(`Failed to update profile for userId: ${profileInput.id}`, { error });
    throw error;
  }
  return data;
}