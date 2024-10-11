import { fail } from "@sveltejs/kit";
import { createListing, getListings } from "$lib/server/database/listings";
import type { Actions, PageServerLoad } from "./$types";
import { getFailFormMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { initCreateListingSchema } from "$lib/shared/models/listing";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession }, parent,
}) => {
  const { session } = await safeGetSession();
  if (!session)
    redirect(303, "/sign-in");

  const { profile } = await parent();
  if (profile.role !== 'teacher')
    redirect(303, '/account');

  const form = await superValidate(zod(initCreateListingSchema))

  let listings;
  try {
    listings = await getListings(supabase, 3, session.user.id);
  } catch (e) {
    console.error("Unable to get listings for id " + session.user.id, e);
    return message(form, getFailFormMessage("Kunde inte hämta konversationer"), { status: 500 });
  }

  return { form, listings };
};

export const actions: Actions = {
  createListing: async (event) => {
    const { locals: { supabase, safeGetSession } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(initCreateListingSchema));
    if (!form.valid) return fail(400, { form });
    const { title } = form.data;

    let listingId = "";
    try {
      const { id } = await createListing(supabase, title, session);
      listingId = id;
    } catch (error) {
      console.error("Failed to create listing", error);
      return message(form, getFailFormMessage(), { status: 500 });
    }
    throw redirect(303, `/listing/${listingId}`);
  },
};
