import { fail, redirect } from "@sveltejs/kit";
import { createListing, getListings } from "$lib/server/database/listings";
import type { PageServerLoad } from "./$types";
import { getGenericErrorMessage } from "$lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { initCreateListingSchema } from "src/lib/models/listing";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();
  if (!session)
    throw redirect(303, "/login");

  const form = await superValidate(zod(initCreateListingSchema))

  let listings;
  try {
    listings = await getListings(supabase, 3, session.user.id);
  } catch (e) {
    console.error(e);
    return message(form, { content: getGenericErrorMessage(undefined, "Kunde inte hämta annonser", undefined), session }, { status: 429 });
  }

  return { form, session, listings };
};

export const actions = {
  createListing: async (event) => {
    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/login");

    const form = await superValidate(event, zod(initCreateListingSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const { title } = form.data;

    let listingId = "";
    try {
      const { id } = await createListing(supabase, title);
      listingId = id;
    } catch (error) {
      console.error("Failed to create listing", error);
      return message(form, getGenericErrorMessage(), { status: 500 });
    }
    throw redirect(303, `/listing/${listingId}`);
  },

  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (session) {
      await supabase.auth.signOut();
      throw redirect(303, "/");
    }
  },
};
