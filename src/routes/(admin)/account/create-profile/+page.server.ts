import {
  defaultErrorTitle,
  getDefaultErrorInfoObjectified,
} from "$lib/shared/constants/constants.ts";
import { error, fail, redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/client";
import { nameSchema, type ProfileInput } from "$lib/shared/models/profile.ts";
import { updateProfile } from "$lib/server/database/profiles.js";
import { hasFullProfile } from "src/lib/shared/utils/profile/utils.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

export async function load({ parent }) {
  const data = await parent();
  const profile = data.profile;

  // user completed their profile
  if (hasFullProfile(profile)) redirect(303, "/account");

  // redirect to select plan if student
  // if (profile.role === "student")
  //   redirect(303, "/account/select_plan");

  const initFormData = {
    firstName: profile.firstName ?? "",
  };

  try {
    const form = await superValidate(initFormData, zod(nameSchema));
    return { form, data };
  } catch (e) {
    const trackingId = logErrorServer({
      error: e,
      message: "Error when loading create profile page",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }
}

export const actions = {
  default: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { user } = await safeGetSession();
    if (!user) redirect(303, "/sign-in");

    const form = await superValidate(event, zod(nameSchema));

    if (!form.valid) return fail(400, { form });

    const { firstName } = form.data;

    const profileInput: ProfileInput = {
      id: user.id,
      first_name: firstName,
    };

    try {
      await updateProfile(supabase, profileInput);
      return message(form, "Skapat profil.");
    } catch (error) {
      console.error("Error on complete profile for userid " + user.id, {
        error,
      });
      return fail(500, {
        errorMessage: defaultErrorTitle, // error or fail? todo fix
      });
    }
  },
};
