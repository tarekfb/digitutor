import { error } from "@sveltejs/kit";
import {
  getFailFormMessage,
  defaultErrorInfo,
  getDefaultErrorInfo,
  costPerRequest,
  MessageId,
  getBaseUrl,
} from "$lib/shared/constants/constants.ts";
import { getProfileByUser } from "$lib/server/database/profiles.ts";
import { getListing } from "$lib/server/database/listings.ts";
import { fail, message, superValidate } from "sveltekit-superforms";
import {
  requestContactSchema,
  startContactSchema,
  type DbConversationWithReferences,
} from "$lib/shared/models/conversation.ts";
import {
  addReviewSchema,
  type ReviewWithReferences,
} from "$lib/shared/models/review.ts";
import { zod } from "sveltekit-superforms/adapters";
import {
  getConversationForStudentAndTeacher,
  startConversation,
} from "$lib/server/database/conversations.ts";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { ResourceAlreadyExistsError } from "src/lib/shared/errors/resource-already-exists-error.js";
import {
  createReview,
  getReviewsByReceiver,
  getReviewsBySender,
} from "src/lib/server/database/review.js";
import type { ListingWithProfile } from "src/lib/shared/models/listing.js";
import {
  type Message,
  ExternalErrorCodes,
} from "src/lib/shared/models/common.js";
import {
  isErrorWithCode,
  loadContactTeacherForms,
} from "src/lib/shared/utils/utils.ts";
import type { Profile } from "src/lib/shared/models/profile.js";
import { formatProfile } from "src/lib/shared/utils/profile/utils.js";
import { formatListingWithProfile } from "src/lib/shared/utils/listing/utils.js";
import { formatReviewWithReferences } from "src/lib/shared/utils/reviews/utils.ts";

import {
  getCreditsByStudent,
  updateCredits,
} from "src/lib/server/database/credits.ts";
import {
  fetchSubscription,
  getOrCreateCustomerId,
} from "src/lib/shared/utils/subscription/subscription-helper.ts";
import RequestNotification from "src/emails/request-notification.svelte";
import { getEmailById, sendEmail } from "src/lib/shared/utils/emails/utils.ts";
import { PUBLIC_ENVIRONMENT } from "$env/static/public";
import { detectSocials, getFormMessageForSocial } from "src/lib/shared/utils/detect-socials/utils.ts";

export const load = async ({
  locals: { supabase, safeGetSession },
  params: { slug: teacherId },
  parent,
  url: { searchParams },
}) => {
  let teacher: Profile;
  try {
    const dbTeacher = await getProfileByUser(supabase, teacherId);
    teacher = formatProfile(dbTeacher);
  } catch (e) {
    if (isErrorWithCode(e)) {
      if (e.code === ExternalErrorCodes.InvalidInputSyntax)
        error(404, {
          message: "Vi kunde inte hitta profilen",
          description:
            "Profilen finns inte eller har tagits bort. Du kan kontakta oss om detta fortsätter.",
        });

      if (e.code === ExternalErrorCodes.ContainsZeroRows)
        error(404, {
          message: "Vi kunde inte hitta profilen",
          description: "Profilen finns inte eller har tagits bort.",
        });
    }
    console.error("Error when reading profile with id: " + teacherId, e);
    error(500, { ...defaultErrorInfo });
  }

  if (teacher.role !== "teacher") {
    console.error("Attempted to read a non-teacher profile: " + teacherId);
    error(
      400,
      getDefaultErrorInfo(
        "Denna profilen är inte tillgänglig just nu",
        "Du kan kontakta oss om detta fortsätter.",
      ),
    );
  }

  const parentData = await parent();
  const student = parentData?.profile ?? undefined;
  const role = student?.role ?? "";
  const { session } = await safeGetSession();
  const userId = session?.user.id;

  let listing: ListingWithProfile | undefined = undefined;
  let listingMessage: Message | undefined = undefined;

  const listingId = searchParams.get("id") || "";
  if (listingId) {
    try {
      const dbListing = await getListing(supabase, listingId);
      listing = formatListingWithProfile(dbListing);
      if (!listing.visible && userId !== listing.profile.id) {
        listingMessage = getFailFormMessage(
          "Vi kunde inte hämta din annons",
          "Denna annonsen är inte tillgänglig just nu.",
        );
        listing = undefined;
      }
      if (listing?.profile.id !== teacher.id) {
        listingMessage = getFailFormMessage("Vi kunde inte hämta din annons");
        listing = undefined;
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === ExternalErrorCodes.InvalidInputSyntax)
          listingMessage = getFailFormMessage("Vi kunde inte hitta din annons");

        if (error.code === ExternalErrorCodes.ContainsZeroRows)
          listingMessage = getFailFormMessage("Vi kunde inte hitta din annons");
      } else
        listingMessage = getFailFormMessage(
          "Vi kunde inte hämta din annons",
          "Något gick fel. Kontakta oss om detta fortsätter.",
        );

      listing = undefined;
      console.error(
        "Error when reading listings for profile with id: " + teacherId,
        error,
      );
    }
  }

  let reviews: ReviewWithReferences[] = [];
  let reviewsMessage: Message | undefined = undefined;
  try {
    const dbReviews = await getReviewsByReceiver(supabase, teacherId);
    reviews = dbReviews.map((review) => formatReviewWithReferences(review));
  } catch (e) {
    console.error(
      "Error when reading reviews for profile with id: " + teacherId,
      e,
    );
    const isOwner = userId === teacherId;
    if (isOwner)
      // only show error info to owner
      reviewsMessage = getFailFormMessage(
        "Vi kunde inte hämta recensioner",
        "Något gick fel. Kontakta oss om detta fortsätter.",
      );
  }

  let allowCreateReview: boolean = false;
  if (role === "student") {
    const hasExistingReview = reviews.find((r) => r.sender?.id === student?.id);
    if (!hasExistingReview) {
      if (userId) {
        try {
          const hasExistingConversation =
            await getConversationForStudentAndTeacher(
              supabase,
              userId,
              teacherId,
            );
          allowCreateReview = hasExistingConversation?.has_replied
            ? true
            : false;
        } catch (error) {
          console.error(
            `Error when adding review for profile slug ${teacherId}, unable to read conversation for teacher & student` +
            teacherId,
            error,
          );
          allowCreateReview = true;
          // incase of error do allow anyway in off-chance it would've been permitted
          // for better UX
          // backend will block bad request anyhow
        }
      }
    }
  }

  // todo: below
  // replace all these fetches with 1 db query RPC function
  // plus if query param do that one seperately

  const { requestContactForm, startContactForm } =
    await loadContactTeacherForms(teacher, student);
  const addReviewForm = await superValidate(
    { rating: 5 },
    zod(addReviewSchema),
  );
  return {
    teacher,
    reviews,
    reviewsMessage,
    listing,
    listingMessage,
    requestContactForm,
    startContactForm,
    addReviewForm,
    allowCreateReview,
  };
};

export const actions = {
  requestContact: async (event) => {
    const {
      locals: { supabase, safeGetSession },
      params: { slug: teacherId },
      cookies,
    } = event;
    const { session } = await safeGetSession();
    if (!session)
      redirect(
        303,
        `/sign-in?next=/profile/${teacherId}`,
        {
          type: "info",
          message: "Skapa ett konto eller logga in för att kontakta en lärare.",
        },
        cookies);

    const userId = session.user.id;
    const form = await superValidate(event, zod(requestContactSchema));
    const { role } = form.data;

    if (!role) {
      console.error(
        "Error when submitting request contact. Data that user does not submit manually is invalid: role",
      ); // user hasnt entered data theirselves, therefore send error message
      redirect(
        303,
        `/sign-in?next=/profile/${teacherId}`,
        {
          type: "info",
          message: "Skapa ett konto eller logga in för att kontakta en lärare.",
        },
        cookies,
      );
    }

    if (teacherId === userId)
      return message(
        form,
        getFailFormMessage(
          "Detta går inte att göra",
          "Du kan inte kontakta dig själv.",
          undefined,
          undefined,
          "default",
        ),
        { status: 403 },
      );

    if (role === "teacher")
      return message(
        form,
        getFailFormMessage(
          "Detta går ej att göra som lärare",
          "Skapa ett konto som student om du vill kontakta en annan lärare.",
          undefined,
          undefined,
          "default",
        ),
        { status: 403 },
      );

    if (role !== "student") {
      console.error("Role was invalid: " + role);
      return message(form, getFailFormMessage(), { status: 500 });
    }

    let conversation: DbConversationWithReferences | null = null;
    try {
      conversation = await getConversationForStudentAndTeacher(
        supabase,
        session.user.id,
        teacherId,
      );
    } catch (error) {
      console.error(
        `unable to read conversation for teacher: ${teacherId} & student: ${session.user.id}, allowing student to contact` +
        teacherId,
        error,
      );
    }

    if (conversation)
      redirect(
        303,
        `/account/conversation/${conversation.id}`,
        { message: "Du har redan kontaktat läraren.", type: "info" },
        event,
      );

    return { form };
  },
  startContact: async (event) => {
    const {
      locals: { supabase, safeGetSession, supabaseServiceRole },
      params: { slug: teacherId },
      cookies,
    } = event;
    const { session, user } = await safeGetSession();
    if (!session || !user)
      redirect(
        303,
        `/sign-in?next=/profile/${teacherId}`,
        {
          type: "info",
          message: "Skapa ett konto eller logga in för att kontakta en lärare.",
        },
        cookies,
      );

    const userId = session.user.id;

    const form = await superValidate(event, zod(startContactSchema));
    // this will not work nicely if teacher or role is invalid, but not expecting this to be an issue
    if (!form.valid)
      return message(
        form,
        getFailFormMessage(
          undefined,
          "Om du inte är inloggad, testa att logga in och försöka igen. Om detta fortsätter kan du kontakta oss.",
        ),
        { status: 403 },
      );

    const { role, firstMessage } = form.data;

    if (!role) {
      console.error(
        "Error when submitting request contact. Data that user does not submit manually is invalid: role",
      ); // user hasnt entered data theirselves, therefore send error message
      redirect(
        303,
        `/sign-in?next=/profile/${teacherId}`,
        {
          type: "info",
          message: "Skapa ett konto eller logga in för att kontakta en lärare.",
        },
        cookies,
      );
    }

    if (teacherId === userId)
      return message(
        form,
        getFailFormMessage(
          undefined,
          "Du kan inte kontakta dig själv.",
          undefined,
          undefined,
          "default",
        ),
        { status: 403 },
      );

    if (role === "teacher")
      return message(
        form,
        getFailFormMessage(
          "Detta går ej att göra som lärare",
          "Skapa ett konto som student om du vill kontakta en annan lärare.",
          undefined,
          undefined,
          "default",
        ),
        { status: 403 },
      );

    if (role !== "student") {
      console.error("Role was invalid: " + role);
      return message(form, getFailFormMessage(), { status: 500 });
    }

    let hasSubscription: boolean = false;
    try {
      const { error: idError, customerId } = await getOrCreateCustomerId({
        supabaseServiceRole,
        user,
      });
      if (idError || !customerId)
        console.error(
          "Error getting or creating customer id. Allowing flow to proceed anyway.",
          idError,
        );

      const { primarySubscription } = await fetchSubscription({
        // @ts-expect-error - ts doesn't understand customerId has value because of if check above
        customerId,
      });

      hasSubscription = primarySubscription ? true : false;
    } catch (error) {
      console.error(
        `Unexpected issue when checking subscription and charging ${costPerRequest} credits for student: ${userId} contacting teacher: ${teacherId}. Allowing flow to procceed.`,
        error,
      );
    }

    let shouldChargeCredits: boolean = false;
    if (!hasSubscription) {
      let balance: number | undefined;
      try {
        balance = await getCreditsByStudent(supabase, userId);
      } catch (error) {
        balance = undefined;
        console.error(
          "Unexpected error when checking if credit balance is enough to contact teacher. Allowing contact.",
          error,
        );
      }

      if (balance !== undefined && balance - costPerRequest < 0) {
        // student doesnt have enough credits
        const missing = (balance - costPerRequest) * -1;
        return message(
          form,
          getFailFormMessage(
            `Du har ${missing} krediter för lite`,
            "",
            MessageId.InsufficientCredits,
            undefined,
            "warning",
          ),
          { status: 403 },
        );
      }

      shouldChargeCredits = true;
    }

    let conversationId: string;
    try {
      const { id } = await startConversation(
        supabase,
        teacherId,
        userId,
        firstMessage.trim(),
        session,
      );
      conversationId = id;
    } catch (error) {
      if (error instanceof ResourceAlreadyExistsError) {
        redirect(
          303,
          `/account/conversation/${error.message}`,
          { message: "Du har redan kontaktat läraren.", type: "info" },
          event,
        );
        // message is conversation id
      }
      console.error(
        "Error when starting conversation for profile slug: " + teacherId,
        error,
      );
      return message(
        form,
        getFailFormMessage(
          undefined,
          "Inga krediter har dragits. Du kan kontakta oss om detta fortsätter.",
        ),
        { status: 500 },
      );
    }

    if (shouldChargeCredits) {
      try {
        await updateCredits(
          supabaseServiceRole,
          -costPerRequest,
          userId,
          `Started contact with teacher: ${teacherId}.`,
        );
      } catch (error) {
        console.error(
          `Unknown error when charging student ${userId} -${costPerRequest} credits, for contacting teacher ${teacherId}. Conversation ${conversationId} already created. Allowing contact.`,
          error,
        );
      }
    }

    let teacherEmail: string | undefined;
    try {
      teacherEmail = await getEmailById(supabaseServiceRole, teacherId)
    } catch (error) {
      console.error("Error getting teacher email. Unable to contact teacher", error);
    }

    let teacherName: string = "";
    try {
      const profile = await getProfileByUser(supabase, teacherId)
      teacherName = profile.first_name;
    } catch (error) {
      console.error(`Error getting teacher first name for id ${teacherId}. Omitting teacher name`, error);
    }


    let studentName: string = "";
    try {
      const profile = await getProfileByUser(supabase, userId)
      studentName = profile.first_name;
    } catch (error) {
      console.error(`Error getting student first name for id ${userId}. Omitting student name`, error);
    }

    let contactRequestUrl = "";
    try {
      contactRequestUrl = `${getBaseUrl(PUBLIC_ENVIRONMENT)}/account/conversation/${conversationId}`
    } catch (error) {
      console.error(`Error getting contact request url for id ${conversationId}. Omitting contact request url`, error);
    }

    if (teacherEmail) {
      try {
        const props = {
          studentName,
          teacherName,
          contactRequestUrl
        };
        const { error: sendError } = await sendEmail(RequestNotification, [teacherEmail], "En elev vill kontakta dig!", props)
        if (sendError)
          console.error("Error sending email for when teacher received contact request", sendError);
      } catch (e) {
        console.error("Error sending email for when teacher received contact request", e);
      }
    }

    redirect(303, `/account/conversation/${conversationId}`);
  },
  addReview: async (event) => {
    const {
      locals: { supabase, safeGetSession },
      params: { slug: teacherId },
      cookies,
    } = event;
    const { session } = await safeGetSession();
    if (!session)
      redirect(
        303,
        `/ sign -in? next = /profile/${teacherId}`,
        {
          type: "info",
          message: "Skapa ett konto eller logga in för att göra en recension.",
        },
        cookies,
      );

    const form = await superValidate(event, zod(addReviewSchema));
    if (!form.valid) return fail(400, { form });
    const { rating, description } = form.data;

    const forbiddenContent = detectSocials(description ?? "");
    if (forbiddenContent) return message(form, getFormMessageForSocial(forbiddenContent), { status: 400 });

    try {
      const conversation = await getConversationForStudentAndTeacher(
        supabase,
        session.user.id,
        teacherId,
      );
      if (!conversation) {
        console.error(
          `Error when adding review for profile slug ${teacherId}, teacher & student has no conversation.`,
        );
        return message(
          form,
          getFailFormMessage(
            undefined,
            "Har ni haft en lektion ihop? Isåfall kan ni kontakta oss för att få hjälp med att göra recensionen.",
          ),
          { status: 403 },
        );
      }
    } catch (error) {
      console.error(
        `Error when adding review for profile slug ${teacherId}, unable to read conversation for teacher & student.Proceeding` +
        teacherId,
        error,
      );
    }

    try {
      const reviews = await getReviewsBySender(supabase, session.user.id, 1);
      if (reviews.length > 0)
        return message(
          form,
          getFailFormMessage(undefined, "Du har redan gjort en recension."),
          { status: 403 },
        );
    } catch (error) {
      console.error(
        "Error when checking if user has already made a review for profile slug: " +
        teacherId,
        error,
      );
    }

    try {
      await createReview(
        supabase,
        { rating, description: description?.trim() ?? "" },
        teacherId,
        session,
      );
    } catch (error) {
      console.error(
        "Error when adding review for profile slug: " + teacherId,
        error,
      );
      return message(form, getFailFormMessage(), { status: 500 });
    }

    setFlash({ message: "Din recension har skapats.", type: "success" }, event);
    return { form };
  },
};
