import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateProfile, ProfileInput } from "$lib/shared/models/profile";
import { getNow, removeUndefined } from "$lib/utils";
import type { Database, Tables } from "src/supabase";
import { InvalidInputError } from "src/lib/shared/errors/invalid-input-error";

export const getProfileByUser = async (
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
  profile: ProfileInput,
): Promise<Tables<"profiles">> => {
  const { id, ...fieldsToUpdate } = profile;
  const dbProfile = removeUndefined(fieldsToUpdate);

  if (Object.keys(dbProfile).length === 0) {
    console.error('Incoming profile had 0 fields to update', { id });
    throw new InvalidInputError(400, 'Missing fields');
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...dbProfile, updated_at: getNow() })
    .eq("id", id)
    .select(`*`)
    .limit(1)
    .order('id')
    .single();

  if (error) {
    console.error(`Failed to update profile for userId: ${profile.id}`, { error });
    throw error;
  }

  return data;
}

