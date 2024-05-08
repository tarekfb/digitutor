import { fail, redirect } from "@sveltejs/kit";
import { formSchema } from "src/lib/components/listing/listing-description.svelte";
import { zod } from "sveltekit-superforms/adapters";
import { unknownErrorMessage } from "src/lib/constants";
import { superValidate } from "sveltekit-superforms";

import { deleteListing, getListingById } from "src/lib/server/database/listings";
export const load = async ({ locals: { supabase, getSession }, params: { slug } }) => {
  try {
    const form = await superValidate(zod(formSchema))
    const session = await getSession();
    const user = session?.user;
    const listing = await getListingById(supabase, slug);
    if (!listing)
      console.error("Missing listing for listing id: " + slug);
    return { listing, user, form };

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
  updateListing: async ({ locals: { supabase, getSession }, params: { slug }, request }) => {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    // const formData = await request.formData();
    // const description = formData.get("title") as string;

    // let validationError;
    // if (!description ||  description === "") validationError = "En rubrik är obligatorisk";

    // if (validationError) {
    //   return fail(400, {
    //     errorMessage: validationError,
    //     errorFields: ["title"],
    //     title,
    //   });
    // }

    // if (!hourlyPrice) validationError = "Ett timpris är obligatoriskt";

    // if (validationError) {
    //   return fail(400, {
    //     errorMessage: validationError,
    //     errorFields: ["title", "hourlyPrice"],
    //     title,
    //   });
    // }

    // const initListing = { title, hourlyPrice };

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
