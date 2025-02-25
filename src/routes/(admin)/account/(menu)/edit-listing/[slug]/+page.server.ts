import { fail, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import {
  defaultErrorInfo,
  getFailFormMessage,
  MessageId,
  defaultErrorDescription,
  getDefaultErrorInfo,
  getDefaultErrorInfoObjectified,
  getFailFormMessageObjectified,
} from "$lib/shared/constants/constants.ts";
import { message, superValidate } from "sveltekit-superforms";
import {
  deleteListing,
  getListing,
  updateListing,
} from "$lib/server/database/listings.ts";
import {
  updateListingSchema,
  type ListingWithProfile,
} from "$lib/shared/models/listing.ts";
import { redirect } from "sveltekit-flash-message/server";
import { isErrorWithCode } from "src/lib/shared/utils/utils.ts";
import {
  formatSubject,
  suggestSubjectSchema,
  type Subject,
} from "src/lib/shared/models/subject.js";
import {
  getSubjects,
  suggestSubject,
} from "src/lib/server/database/subjects.ts";
import type { Tables } from "src/supabase.ts";
import { findSimilarSubjects } from "src/lib/shared/utils/subjects/utils.ts";
import { ExternalErrorCodes } from "src/lib/shared/models/common.js";
import { formatListingWithProfile } from "src/lib/shared/utils/listing/utils.js";
import { logError } from "src/lib/shared/utils/logging/utils.ts";
import type { Actions } from "./$types.js";

export const load = async ({
  locals: { supabase },
  params: { slug },
  parent,
}) => {
  const { session } = await parent();
  if (!session) redirect(303, "/sign-in");

  let listing: ListingWithProfile;
  try {
    const dbListing = await getListing(supabase, slug);
    listing = formatListingWithProfile(dbListing);
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === ExternalErrorCodes.InvalidInputSyntax)
        error(404, {
          message: "Vi kunde inte hitta annonsen",
          description:
            "Annonsen finns inte eller har tagits bort. Du kan kontakta oss om detta fortsätter.",
        });

      if (e.code === ExternalErrorCodes.ContainsZeroRows)
        error(404, {
          message: "Vi kunde inte hitta annonsen",
          description: "Annonsen finns inte eller har tagits bort.",
        });
    }
    const trackingId = logError(e, {
      message: "Error when reading listing with id " + slug,
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  if (session?.user.id !== listing.profile.id) {
    const trackingId = logError(new Error("Unauthorized access to listing"), {
      message: "Attempted to access a listing not owned by the user",
      listingId: listing.id,
      userId: session?.user.id,
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  let subjects: Subject[] = [];
  try {
    const rawSubjects = await getSubjects(supabase);
    subjects = rawSubjects.map((s) => formatSubject(s));
  } catch (e) {
    const trackingId = logError(e, {
      message: "Error while fetching subjects",
    });
    error(500, { ...getDefaultErrorInfoObjectified({ trackingId }) });
  }

  const updateListingForm = await superValidate(
    { ...listing, hourlyPrice: listing.hourlyPrice },
    zod(updateListingSchema),
    { errors: false },
  );
  const suggestSubjectForm = await superValidate(zod(suggestSubjectSchema));
  return { subjects, updateListingForm, suggestSubjectForm };
};

export const actions: Actions = {
  deleteListing: async ({
    locals: { supabase, safeGetSession },
    cookies,
    params: { slug },
  }) => {
    const { session } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    try {
      await deleteListing(supabase, slug, session);
    } catch (error) {
      console.error("Error when deleting listing slug id: " + slug, error);
      return fail(500, {
        errorMessage: defaultErrorDescription, // error or fail? todo fix
      });
    }

    throw redirect(
      303,
      `/account`,
      { message: "Annonsen är borttagen.", type: "success" },
      cookies,
    );
  },
  updateListing: async (event) => {
    const {
      locals: { supabase, safeGetSession },
      params: { slug },
    } = event;
    const { session } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(updateListingSchema));
    if (!form.valid) return fail(400, { form });

    try {
      await updateListing(supabase, form.data, slug, session);
      return { form };
    } catch (error) {
      const trackingId = logError(error, {
        message: "Error when updating listing slug id: " + slug,
      });
      return message(form, getFailFormMessageObjectified({ trackingId }), { status: 500 });
    }
  },
  suggestSubject: async (event) => {
    const {
      locals: { supabase, safeGetSession },
      params: { slug },
    } = event;
    const { session } = await safeGetSession();
    if (!session) throw redirect(303, "/sign-in");

    const form = await superValidate(event, zod(suggestSubjectSchema));
    if (!form.valid) return fail(400, { form });
    const { isRetry } = form.data;
    const email = form.data.email ? form.data.email.trim() : undefined;
    const subject = form.data.subject.trim();

    if (!isRetry) {
      try {
        const subjects = await getSubjects(supabase);
        const matches = findSimilarSubjects(subject, subjects);
        if (matches.length > 0)
          return message(
            form,
            getFailFormMessage(
              `Detta verkar redan finnas: ${matches[0].title}`,
              "Om detta inte stämmer kan du skicka in förslaget ändå.",
              MessageId.ResourceAlreadyExists,
              undefined,
              "default",
            ),
            { status: 400 },
          ); // Todo: add some link or so in GUI to let user contact easily
      } catch (error) {
        logError(error, {
          message: "Error when looking for match. Allowing user to insert suggestion.",
          slug,
        });
      }
    }

    let suggestion: Tables<"subjects_suggestions">;
    try {
      suggestion = await suggestSubject(
        supabase,
        session.user.id,
        subject,
        email,
      );
    } catch (error) {
      const trackingId = logError(error, {
        message: "Error when adding suggestion",
        slug,
      });
      return message(form, getFailFormMessageObjectified({ trackingId }), { status: 500 });
    }

    // todo send email to admin here
    console.info("fake sending email", { suggestion });
    return { form };
  },
};
