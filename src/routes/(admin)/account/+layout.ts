import { redirect } from "@sveltejs/kit";
import { hasFullProfile } from "src/lib/shared/utils/profile/utils";

export const load = async ({ data, url }) => {
  const { profile } = data;

  const createProfilePath = "/account/create-profile";
  if (!hasFullProfile(profile) && url.pathname !== createProfilePath)
    redirect(303, createProfilePath);

  return { profile }; // todo: available in parent? No need to return here?
};
