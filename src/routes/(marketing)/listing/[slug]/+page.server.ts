import { fail, redirect, error } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { getGenericErrorMessage, unknownErrorMessage } from "$lib/constants";
import { message, superValidate } from "sveltekit-superforms";
import { deleteListing, getListing, updateListing } from "$lib/server/database/listings";
import { createListingSchema } from "$lib/models/listing";
import { startConversation } from "src/lib/server/database/conversations";
import { startConversationSchema } from "src/lib/models/conversations";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
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

  const createListingForm = await superValidate(listing, zod(createListingSchema))
  const startConversationForm = await superValidate({ teacher: listing.profile?.id }, zod(startConversationSchema))
  return { listing, createListingForm, startConversationForm };
}

export const actions = {
  deleteListing: async ({ locals: { supabase, getSession }, params: { slug } }) => {
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");
    try {
      await deleteListing(supabase, slug);
    } catch (error) {
      console.error("Error when deleting listing slug id: " + slug, error);
      return fail(500, {
        errorMessage: unknownErrorMessage,
      });
    }
    throw redirect(303, `/account`);
  },
  updateListing: async (event) => {
    const { locals: { supabase, getSession }, params: { slug } } = event;
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login");

    const form = await superValidate(event, zod(createListingSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    try {
      await updateListing(supabase, form.data, slug);
      return { form };
    } catch (error) {
      return message(form, getGenericErrorMessage(), { status: 500 });
    }
  },
  contact: async (event) => {
    const { locals: { supabase, getSession }, params: { slug } } = event;
    const session = await getSession();
    if (!session)
      throw redirect(303, "/login"); // todo: in the future should implement a redirect after login


    const form = await superValidate(event, zod(startConversationSchema));
    if (!form.valid) {
      return message(form, getGenericErrorMessage(), { status: 500 });
    }

    const { teacher } = form.data;
    if (!teacher) {
      console.error("Error when starting conversation for listing slug: " + slug, error);
      return
    }

    if (teacher === session.user.id)
      return message(form, getGenericErrorMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

    let conversationId: string;
    try {
      const { id } = await startConversation(supabase, teacher, session.user.id);
      conversationId = id;
    } catch (error) {
      console.error("Error when starting conversation for listing slug: " + slug, error);
      return message(form, getGenericErrorMessage(), { status: 500 });
    }
    throw redirect(303, `/account/conversation/${conversationId}`);
  }
}