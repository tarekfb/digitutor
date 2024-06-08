
import type { Tables } from "src/supabase.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ data, depends, url }) => {
  const profile: Tables<"profiles"> | null = data.profile;

  const createProfilePath = "/account/create_profile";
  if (
    profile &&
    !_hasFullProfile(profile) &&
    url.pathname !== createProfilePath
  )
    throw redirect(303, createProfilePath);

  return { profile }; // todo: available in parent? No need to return here?
};

export const _hasFullProfile = (profile: Tables<"profiles"> | null) => {
  if (!profile)
    return false;

  if (!profile.first_name || !profile.last_name)
    return false;

  return true;
};
