import { fail, redirect } from "@sveltejs/kit";
import { createListing, getListings } from "$lib/server/database/listings";
import type { PageServerLoad } from "./$types";
import { unknownErrorMessage } from "src/lib/constants";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  const session = await getSession();

  if (!session)
    throw redirect(303, "/login");

  try {
    const listings = await getListings(supabase, 3, session.user.id);
    return { session, listings };
  } catch (e) {
    console.error(e);
    // TODO: setFlash unable to fetch listings something went wrong
    // return fail(500, {
    //   message: "Unknown error. If issue persists, please contact us.",
    // });
  }
  return { session, listings: [] };
};

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
      console.error(error);
      return fail(500, {
        errorMessage: unknownErrorMessage,
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
