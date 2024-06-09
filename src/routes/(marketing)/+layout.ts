import type { Tables } from "src/supabase.js";

export const load = async ({ data }) => {
  return { profile: data.profile, listings: data.listings };  // todo: available in parent? No need to return here?
};

export const _hasFullProfile = (profile: Tables<"profiles"> | null) => {
  if (!profile)
    return false;

  if (!profile.first_name || profile.last_name)
    return false;

  return true;
};
