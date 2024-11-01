import { fail, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { getFailFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { deleteListing, getListing, updateListing } from "$lib/server/database/listings";
import { updateListingSchema } from "$lib/shared/models/listing";
import { redirect } from "sveltekit-flash-message/server";
import { isPostgrestError } from "src/lib/utils";

export const load = async ({ locals: { supabase }, params: { slug }, parent }) => {

  const { session } = await parent();
  if (!session)
    redirect(303, "/sign-in");

  let listing;
  try {
    listing = await getListing(supabase, slug);
  } catch (e) {
    if (isPostgrestError(e)) {
      console.error("PostgrestError when reading listing with id: " + slug, e);
      error(404, { message: "Här finns det ingen annons. Har den tagits bort kanske?" });
    } else {
      console.error("Unknown error when reading listing with id: " + slug, e);
      error(500, {
        message: "Annonsen hittades inte",
        description: "Du kan kontakta oss om detta fortsätter."
      });
    }
  };

  if (session?.user.id !== listing.profile.id) {
    console.error("Tried to read listing that is not theirs. listingid: " + listing.id + " userid: " + session?.user.id);
    error(400, {
      message: "Något gick fel."
    });
  }


  const updateListingForm = await superValidate({ ...listing, hourlyPrice: listing.hourly_price }, zod(updateListingSchema))
  return { listing, updateListingForm };
}

export const actions = {
  deleteListing: async ({ locals: { supabase, safeGetSession }, cookies, params: { slug } }) => {
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/sign-in");
    try {
      await deleteListing(supabase, slug, session);
    } catch (error) {
      console.error("Error when deleting listing slug id: " + slug, error);
      return fail(500, {
        errorMessage: unknownErrorMessage, // error or fail? todo fix
      });
    }

    throw redirect(303, `/account`, { message: 'Annonsen är borttagen.', type: 'success' }, cookies);
  },
  updateListing: async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(updateListingSchema));

    if (!form.valid) return fail(400, { form });

    try {
      await updateListing(supabase, form.data, slug, session);
      return { form };
    } catch (error) {
      return message(form, getFailFormMessage(), { status: 500 });
    }
  },
}