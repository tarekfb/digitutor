import { unknownErrorMessage, unknownErrorTitle } from "$lib/shared/constants/constants";
import { _hasFullProfile } from "src/routes/(admin)/account/+layout.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/client";
import { nameSchema, type ProfileInput } from "$lib/shared/models/profile";
import { updateProfile } from "$lib/server/database/profiles.js";

export async function load({ parent }) {
  const data = await parent();
  const profile = data.profile;

  // user completed their profile
  if (_hasFullProfile(profile))
    redirect(303, "/account");

  // redirect to select plan if student
  // if (profile.role === "student")
  //   redirect(303, "/account/select_plan");

  const initFormData = {
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
  }

  try {
    const form = await superValidate(initFormData, zod(nameSchema))
    return { form, data };
  } catch (e) {
    console.error("Error when loading createprofile", e);
    error(500, {
      message: unknownErrorTitle,
    });
  };
}

export const actions = {
  default: async (event) => {
    const { locals: { supabase, safeGetSession } } = event;
    const { user } = await safeGetSession();
    if (!user)
      redirect(303, "/sign-in");

    const form = await superValidate(event, zod(nameSchema));

    if (!form.valid) return fail(400, { form });

    const { firstName, lastName } = form.data;

    const profileInput: ProfileInput = {
      id: user.id,
      first_name: firstName,
      last_name: lastName
    }

    try {
      await updateProfile(supabase, profileInput);
      return message(form, 'Skapat profil.');
    } catch (error) {
      console.error("Error on complete profile for userid " + user.id, { error });
      return fail(500, {
        errorMessage: unknownErrorMessage, // error or fail? todo fix
      });
    }

  }
}