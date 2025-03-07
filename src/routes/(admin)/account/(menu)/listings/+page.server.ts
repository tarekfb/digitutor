import { error, fail } from "@sveltejs/kit";
import { createListing, getListings } from "$lib/server/database/listings.ts";
import type { Actions, PageServerLoad } from "./$types.ts";
import {
  getFailFormMessage,
  getDefaultErrorInfo,
} from "$lib/shared/constants/constants.ts";
import { message, superValidate } from "sveltekit-superforms";
import {
  initCreateListingSchema,
  type ListingWithProfile,
} from "$lib/shared/models/listing.ts";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "sveltekit-flash-message/server";
import { formatListingWithProfile } from "src/lib/shared/utils/listing/utils.ts";
import { logErrorServer } from "src/lib/shared/utils/logging/utils.ts";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
  parent,
}) => {
  const { session } = await safeGetSession();
  if (!session) redirect(303, "/sign-in");

  const { profile } = await parent();
  if (profile.role !== "teacher") redirect(303, "/account");

  let listings: ListingWithProfile[];
  try {
    const dbListings = await getListings(supabase, 4, session.user.id);
    listings = dbListings.map((listing) => formatListingWithProfile(listing));
  } catch (e) {
    const trackingId = logErrorServer({
      error: e,
      message: "Error while fetching listings in profile page with userId: " + session.user.id,
    });
    error(500, { ...getDefaultErrorInfo({ trackingId, message: "Kunde inte hämta konversationer" }) });
  }

  const form = await superValidate(
    { nbrOfListings: listings.length },
    zod(initCreateListingSchema),
    { errors: false },
  );
  return { form, listings };
};

export const actions: Actions = {
  createListing: async (event) => {
    const {
      locals: { supabase, safeGetSession },
    } = event;
    const { session } = await safeGetSession();
    if (!session) redirect(303, "/sign-in");

    const form = await superValidate(event, zod(initCreateListingSchema));

    if (!form.valid) return fail(400, { form });
    const { title } = form.data;
    let { nbrOfListings } = form.data;

    if (nbrOfListings === undefined) {
      logErrorServer({ message: "User had undefined nbr of listings and tried to create listing, allow creation.", },);
      nbrOfListings = 0;
    }

    if (nbrOfListings > 4)
      return message(
        form,
        getFailFormMessage(
          {
            title: "Du har för många annonser",
            description: "Ta bort en annons innan du skapar en ny.",
            variant: "warning",
          }),
        { status: 400 },
      );

    let listingId = "";
    try {
      const { id } = await createListing(supabase, title.trim(), session);
      listingId = id;
    } catch (error) {
      const trackingId = logErrorServer({
        error,
        message: "Error when creating listing",
      });
      return message(
        form,
        getFailFormMessage({ trackingId }),
        { status: 500 },
      );
    }
    redirect(303, `/account/edit-listing/${listingId}`);
  },
};
