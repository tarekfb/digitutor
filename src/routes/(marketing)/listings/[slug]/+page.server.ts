import { fail, redirect } from "@sveltejs/kit";
import { unknownErrorMessage } from "src/lib/constants";
import { deleteListing, getListingById } from "src/lib/server/database/listings";

export const load = async ({ locals: { supabase, getSession }, params: { slug } }) => {

  try {
    const session = await getSession();
    const user = session?.user;
    const listing = await getListingById(supabase, slug);
    if (!listing)
      console.error("Missing listing for listing id: " + slug);
    return { listing, user };

  } catch (error) {
    console.error("Error when reading listing with id: " + slug, error);
    return fail(500, {
      errorMessage: unknownErrorMessage,
    });
  }
};

export const actions = {
  deleteListing: async ({ locals: { supabase, getSession }, params: { slug } }) => {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    try {
      await deleteListing(supabase, slug);
    } catch (error) {
      return fail(500, {
        errorMessage: unknownErrorMessage,
      });
    }
    throw redirect(303, `/account`);
  },
};
