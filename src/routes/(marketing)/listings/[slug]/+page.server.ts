import { fail, redirect } from "@sveltejs/kit";
import { unknownErrorMessage } from "src/lib/constants";
import { deleteListing, getListingById } from "src/lib/server/database/listings";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
  try {
    const listing = await getListingById(supabase, slug);
    if (!listing)
      console.error("Missing listing for listing id: " + slug);
    return { listing };

  } catch (error) {
    console.error("Missing listing for listing id: " + slug, error);
    return fail(500, {
      errorMessage: unknownErrorMessage,
    });
  }
};


export const actions = {
  deleteListing: async ({ locals: { supabase, getSession }, params: { slug } }) => {
    console.log("entered delete lising")

    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    console.log(session === null)
    try {
      console.log("inside try")
      await deleteListing(supabase, slug);
    } catch (error) {
      return fail(500, {
        errorMessage: unknownErrorMessage,
      });
    }
    console.log("redirecting coming")
    throw redirect(303, `/account`);
  },
};
