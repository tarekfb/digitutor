import { error, fail } from "@sveltejs/kit";
import { createListing, getListings } from "$lib/server/database/listings";
import type { PageServerLoad } from "./$types";
import { getGenericFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { initCreateListingSchema } from "$lib/shared/models/listing";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession }, parent,
}) => {
  const { session } = await safeGetSession();
  if (!session)
    throw redirect(303, "/auth");

  const form = await superValidate(zod(initCreateListingSchema))

  let listings;
  try {
    listings = await getListings(supabase, 3, session.user.id);
  } catch (e) {
    console.error(e);
    return message(form, { content: getGenericFormMessage(undefined, "Kunde inte hämta annonser", undefined), session }, { status: 429 });
  }

  const { profile } = await parent();

  return { form, session, listings, profile };
};

export const actions = {
  createListing: async (event) => {
    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/auth");

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
      return message(form, getGenericFormMessage(), { status: 500 });
    }
    throw redirect(303, `/listing/${listingId}`);
  },

  signout: async ({ locals: { supabase, safeGetSession }, cookies }) => {
    const { session } = await safeGetSession();
    if (!session)
      redirect(303, "/auth");

    const { error: e } = await supabase.auth.signOut();
    if (e) {
      console.error('Unknown error on signout', e);
      error(500, unknownErrorMessage);
    }

    throw redirect(303, "/", { message: 'Du har loggats ut.', type: 'success' }, cookies);
  },
};
