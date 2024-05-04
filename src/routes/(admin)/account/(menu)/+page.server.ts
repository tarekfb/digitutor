import { fail, redirect } from "@sveltejs/kit";
import { createListing } from "$lib/server/database/listings";

export const actions = {
  createListing: async ({ locals: { supabase, getSession }, request }) => {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const hourlyPrice = formData.get("hourlyPrice") as string;

    let validationError;
    if (!title || title === "") validationError = "En rubrik är obligatorisk";

    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["title"],
        title,
      });
    }

    if (!hourlyPrice) validationError = "Ett timpris är obligatoriskt";

    if (validationError) {
      return fail(400, {
        errorMessage: validationError,
        errorFields: ["title", "hourlyPrice"],
        title,
      });
    }

    const initListing = { title, hourlyPrice };

    let listingId = "";
    try {
      const { id } = await createListing(supabase, initListing);
      listingId = id;
    } catch (error) {
      return fail(500, {
        errorMessage: "Unknown error. If this persists please contact us.",
        initListing,
      });
    }
    throw redirect(303, `/listings/${listingId}`);
  },

  signout: async ({ locals: { supabase, getSession } }) => {
    const session = await getSession();
    if (session) {
      await supabase.auth.signOut();
      throw redirect(303, "/");
    }
  },
};
