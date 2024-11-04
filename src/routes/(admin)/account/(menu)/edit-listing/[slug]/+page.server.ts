import { fail, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { getFailFormMessage, MessageId, unknownErrorMessage, unknownErrorTitle } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { deleteListing, getListing, updateListing } from "$lib/server/database/listings";
import { updateListingSchema } from "$lib/shared/models/listing";
import { redirect } from "sveltekit-flash-message/server";
import { isPostgrestError } from "src/lib/shared/utils/utils";
import { formatSubject, suggestSubjectSchema, type Subject } from "src/lib/shared/models/subject.js";
import { getSubjects, suggestSubject } from "src/lib/server/database/subjects";
import type { Tables } from "src/supabase";
import { findSimilarSubjects } from "src/lib/shared/utils/subjects/utils";

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
    error(400, unknownErrorTitle);
  }

  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map(s => formatSubject(s));
  } catch (e) {
    console.error("Unknown error when reading subjects", e);
    error(500, unknownErrorTitle);
  };

  const updateListingForm = await superValidate({ ...listing, hourlyPrice: listing.hourly_price }, zod(updateListingSchema), { errors: false })
  const suggestSubjectForm = await superValidate(zod(suggestSubjectSchema))
  return { subjects, updateListingForm, suggestSubjectForm };
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

    const form = await superValidate(event, zod(updateListingSchema))
    if (!form.valid) return fail(400, { form });

    try {
      await updateListing(supabase, form.data, slug, session);
      return { form };
    } catch (error) {
      console.error("Error when updating listing slug id: " + slug, error);
      return message(form, getFailFormMessage(), { status: 500 });
    }
  },
  suggestSubject: async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(suggestSubjectSchema))
    if (!form.valid) return fail(400, { form });
    const { subject, email, isRetry } = form.data;

    if (!isRetry) {
      try {
        const subjects = await getSubjects(supabase);
        const matches = findSimilarSubjects(subject, subjects);
        if (matches.length > 0)
          return message(form, getFailFormMessage(`Detta verkar redan finnas: ${matches[0].title}`, "Om detta inte stämmer kan du skicka in förslaget ändå.", MessageId.ResourceAlreadyExists, undefined, "default"), { status: 400 }); // Todo: add some link or so in GUI to let user contact easily
      } catch (error) {
        console.error("Error when looking for match. Allowing user to insert suggestion. slug: " + slug, error);
      }
    }

    let suggestion: Tables<"subjects_suggestions">;
    try {
      suggestion = await suggestSubject(supabase, session.user.id, subject, email);
    } catch (error) {
      console.error("Error when adding suggestion", error);
      return message(form, getFailFormMessage(), { status: 500 });
    }


    // send email to admin here
    console.log("fake sending email", { suggestion })
    return { form };

  },
}