import { fail, redirect, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { unknownErrorMessage } from "$lib/constants";
import { superValidate } from "sveltekit-superforms";
import { deleteListing, getListingById } from "$lib/server/database/listings";
import { listingSchema } from "$lib/models/listing";

export const load = async ({ locals: { supabase, getSession }, params: { slug } }) => {
  try {
    const session = await getSession();
    const user = session?.user;
    const listing = await getListingById(supabase, slug);
    const form = await superValidate(listing, zod(listingSchema))
    if (!listing)
      console.error("Missing listing for listing id: " + slug);
    return { listing, user, form };

  } catch (e) {
    console.error("Error when reading listing with id: " + slug, e);
    throw error(500, {
      message: unknownErrorMessage,
    });
  };
}

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
  updateListing: async (event) => {
    const { locals: { supabase, getSession }, params: { slug } } = event;
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    const form = await superValidate(event, zod(listingSchema));

    console.log(form.data)

    if (!form.valid)
      return fail(400, {
        form,
      });

    try {
      // await updateListing(supabase, slug);
      console.log("reached listing with slug: " + slug);
      return {
        form,
      };
    } catch (error) {
      return fail(500, {
        form,
      });
    }
  },
};
