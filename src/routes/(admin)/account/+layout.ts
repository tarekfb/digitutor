
import { redirect } from "@sveltejs/kit";
import type { Profile } from "src/lib/shared/models/profile.js";

export const load = async ({ data, url }) => {
  const { profile } = data;

  const createProfilePath = "/account/create-profile";
  if (!_hasFullProfile(profile) && url.pathname !== createProfilePath)
    redirect(303, createProfilePath);

  return { profile }; // todo: available in parent? No need to return here?
};

export const _hasFullProfile = (profile: Profile) => {
  if (!profile)
    return false;

  if (!profile.firstName || !profile.lastName)
    return false;

  return true;
};
