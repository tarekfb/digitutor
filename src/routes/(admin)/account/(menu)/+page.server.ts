import { error, fail, redirect } from "@sveltejs/kit";
import { createListing, getListings } from "$lib/server/database/listings";
import type { PageServerLoad } from "./$types";
import { getGenericErrorMessage, unknownErrorMessage } from "$lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { initCreateListingSchema } from "src/lib/models/listing";
import { zod } from "sveltekit-superforms/adapters";
import type { Session } from "@supabase/supabase-js";

export const load: PageServerLoad = async ({
  locals: { supabase, getSession },
}) => {
  let session: Session | null;
  try {
    session = await getSession();
    if (!session)
      throw redirect(303, "/login");
  } catch (e) {
    console.error("Error when loading account root", e);
    throw new Error(unknownErrorMessage)
  }

  const form = await superValidate(zod(initCreateListingSchema))

  try {
    const listings = await getListings(supabase, 3, session.user.id);
    return { form, session, listings };
  } catch (e) {
    console.error(e);
    return message(form, { content: getGenericErrorMessage(undefined, "Kunde inte hämta annonser", undefined), session }, { status: 429 });
  }
};

export const actions = {
  createListing: async (event) => {
    const { locals: { supabase, getSession }, request } = event;
    const session = await getSession();
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
      console.error(error);
      return message(form, getGenericErrorMessage(), { status: 500 });
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
