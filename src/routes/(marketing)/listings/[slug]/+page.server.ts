import { error, fail, redirect } from "@sveltejs/kit";
import { unknownErrorMessage } from "src/lib/constants";
import { deleteListing, getListingById } from "src/lib/server/database/listings";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
  const listing = await getListingById(supabase, slug);

  if (!listing)
    console.log("Missing listing for listing id: " + slug);

  return { listing };
};


export const actions = {
  deleteListing: async ({ locals: { supabase, getSession }, request, params: { slug } }) => {
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
