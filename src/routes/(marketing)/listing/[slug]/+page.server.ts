import { fail, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { getGenericFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { message, superValidate } from "sveltekit-superforms";
import { deleteListing, getListing, updateListing } from "$lib/server/database/listings";
import { createListingSchema } from "$lib/shared/models/listing";
import { getConversationForStudentAndTeacher, startConversation } from "$lib/server/database/conversations";
import { requestContactSchema, startContactSchema } from "$lib/shared/models/conversation";
import { redirect } from "sveltekit-flash-message/server";
import { ResourceAlreadyExistsError } from "src/lib/shared/errors/resource-already-exists-error";
import { getReviewsByReceiver } from "src/lib/server/database/review";
import type { Review } from "src/lib/shared/models/review.js";

export const load = async ({ locals: { supabase }, params: { slug }, parent }) => {
  let listing;
  try {
    listing = await getListing(supabase, slug);
  } catch (e) {
    console.error("Error when reading listing with id: " + slug, e);
    throw error(500, {
      message: unknownErrorMessage,
    });
  };
  if (!listing)
    throw error(404, {
      message: 'Not found'
    });

  const parentData = await parent();
  const role = parentData.profile?.role ?? "";

  let reviews: Review[] = [];
  try {
    reviews = await getReviewsByReceiver(supabase, listing.profile.id) ?? [];
  } catch (e) {
    console.error(`Error when reading reviews for profile ${listing.profile.id} on listing ${slug}`, e);
  }

  const createListingForm = await superValidate(listing, zod(createListingSchema))
  const requestContactForm = await superValidate({ teacher: listing.profile.id, role }, zod(requestContactSchema))
  const startContactForm = await superValidate({ teacher: listing.profile.id, role }, zod(startContactSchema))
  return { listing, reviews, createListingForm, requestContactForm, startContactForm };
}

export const actions = {
  deleteListing: async ({ locals: { supabase, safeGetSession }, cookies, params: { slug } }) => {
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/auth");
    try {
      await deleteListing(supabase, slug, session);
    } catch (error) {
      console.error("Error when deleting listing slug id: " + slug, error);
      return fail(500, {
        errorMessage: unknownErrorMessage,
      });
    }

    throw redirect(303, `/account`, { message: 'Annonsen är borttagen.', type: 'success' }, cookies);
  },
  updateListing: async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/auth");

    const form = await superValidate(event, zod(createListingSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    try {
      await updateListing(supabase, form.data, slug, session);
      return { form };
    } catch (error) {
      return message(form, getGenericFormMessage(), { status: 500 });
    }
  },
  requestContact: async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/auth"); // todo: in the future should implement a redirect after login

    const form = await superValidate(event, zod(requestContactSchema));
    if (!form.valid) {
      console.error("Error when submitting request contact. Data that user does not submit manually is invalid") // user hasnt entered data theirselves, therefore send error message
      return message(form, getGenericFormMessage(), { status: 500 });
    }

    const { teacher, role } = form.data;

    if (teacher === session.user.id)
      return message(form, getGenericFormMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

    if (role !== "student") {
      console.error("Non-student tried to contact teacher for listing slug: " + slug, error);
      return message(form, getGenericFormMessage(), { status: 500 });
    }

    const conversation = await getConversationForStudentAndTeacher(supabase, session.user.id, teacher);
    if (conversation)
      redirect(303, `/account/conversation/${conversation.id}`, { message: 'Du har redan kontaktat läraren.', type: 'info' }, event);

    return { form };
  },
  startContact: async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug } } = event;
    const { session } = await safeGetSession();
    if (!session)
      throw redirect(303, "/auth"); // todo: in the future should implement a redirect after login

    const form = await superValidate(event, zod(startContactSchema));
    if (!form.valid) { // this will not work nicely if teacher or role is invalid, but not expecting this to be an issue
      return fail(400, {
        form,
      });
    }

    const { teacher, role, firstMessage } = form.data;

    if (teacher === session.user.id)
      return message(form, getGenericFormMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

    if (role !== "student") {
      console.error("Non-student tried to contact teacher for listing slug: " + slug, error);
      return message(form, getGenericFormMessage(), { status: 500 });
    }

    if (teacher === session.user.id)
      return message(form, getGenericFormMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

    let conversationId: string;
    try {
      const { id } = await startConversation(supabase, teacher, session.user.id, firstMessage, session);
      conversationId = id;
    } catch (error) {
      if (error instanceof ResourceAlreadyExistsError) {
        throw redirect(303, `/account/conversation/${error.message}`, { message: 'Du har redan kontaktat läraren.', type: 'info' }, event); // message is conversation id
      }
      console.error("Error when starting conversation for listing slug: " + slug, error);
      return message(form, getGenericFormMessage(), { status: 500 });
    }
    throw redirect(303, `/account/conversation/${conversationId}`);
  }
}