import { fail, redirect, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { unknownErrorMessage } from "$lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { deleteListing, getListing, updateListing } from "$lib/server/database/listings";
import { createListingSchema } from "$lib/models/listing";

export const load = async ({ locals: { supabase, getSession }, params: { slug } }) => {
  try {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    const listing = await getListing(supabase, slug);
    if (!listing)
      error(404, {
        message: 'Not found'
      });

    const form = await superValidate(listing, zod(createListingSchema))

    return { listing, form };
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

    const form = await superValidate(event, zod(createListingSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    try {
      await updateListing(supabase, form.data, slug);
      return message(form, 'Annonsen är uppdaterad.');
    } catch (error) {
      return fail(500, {
        form,
      });
    }
  },
};
