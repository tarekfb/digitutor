import { unknownErrorMessage } from "$lib/shared/constants/constants";
import { _hasFullProfile } from "src/routes/(admin)/account/+layout.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/client";
import { nameSchema } from "$lib/shared/models/profile";
import { getProfileBySession, updateProfile } from "$lib/server/database/profiles.js";
import type { Tables } from "src/supabase";

export async function load({ parent }) {
  const data = await parent();
  const profile = data.profile;

  // user completed their profile
  // redirect to select plan if student
  if (_hasFullProfile(profile)) {
    if (profile.role === "student")
      throw redirect(303, "/account/select_plan");
    throw redirect(303, "/account");
  }

  const initFormData = {
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
  }

  try {
    const form = await superValidate(initFormData, zod(nameSchema))
    return { form, data };
  } catch (e) {
    console.error("Error when loading createprofile", e);
    throw error(500, {
      message: unknownErrorMessage,
    });
  };
}

export const actions = {
  default: async (event) => {
    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/auth");

    const form = await superValidate(event, zod(nameSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { firstName, lastName } = form.data;

    let profile: Tables<"profiles">;
    try {
      profile = await getProfileBySession(supabase, session);
    } catch (error) {
      console.error("Error on fetch profile in complete profile", error);
      return fail(500, {
        message: unknownErrorMessage, form
      });
    }

    profile = {
      ...profile,
      first_name: firstName,
      last_name: lastName
    };


    try {
      await updateProfile(supabase, profile);
      return message(form, 'Skapat profil.');
    } catch (error) {
      console.error("Error on complete profile for userid " + profile.id, error);
      return fail(500, {
        message: unknownErrorMessage, form,
      });
    }

  }
}