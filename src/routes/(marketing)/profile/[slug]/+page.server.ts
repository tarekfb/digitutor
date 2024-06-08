import { error, redirect } from "@sveltejs/kit";
import { getGenericErrorMessage, unknownErrorMessage } from "$lib/constants";
import { getProfileByUserId } from "src/lib/server/database/profiles";
import { getListingsByTeacherId } from "src/lib/server/database/listings";
import { message, superValidate } from "sveltekit-superforms";
import { contactSchema } from "src/lib/models/conversations";
import { zod } from "sveltekit-superforms/adapters";
import { startConversation } from "src/lib/server/database/conversations";

export const load = async ({ locals: { supabase }, params: { slug } }) => {
    let profile;
    try {
        profile = await getProfileByUserId(supabase, slug);
    } catch (e) {
        console.error("Error when reading profile with id: " + slug, e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    };

    if (profile.role !== "teacher") {
        console.error("Attempted to read a non-teacher profile: " + slug);
        throw error(500, {
            message: unknownErrorMessage,
        });
    }

    let listings;
    try {
        listings = await getListingsByTeacherId(supabase, slug, undefined, true);
    } catch (e) {
        console.error("Error when reading listings for profile with id: " + slug, e);
        throw error(500, {
            message: unknownErrorMessage,
        });
    }

    const contactForm = await superValidate({ teacher: profile.id }, zod(contactSchema))

    return { profile, listings, contactForm };
}


export const actions = {
    contact: async (event) => {
        const { locals: { supabase, session }, params: { slug } } = event;
        if (!session)
            throw redirect(303, "/login"); // todo: in the future should implement a redirect after login

        const form = await superValidate(event, zod(contactSchema));
        if (!form.valid) {
            return message(form, getGenericErrorMessage(), { status: 500 });
        }

        const { teacher } = form.data;
        if (!teacher) {
            console.error("Error when starting conversation for listing slug: " + slug, error);
            return message(form, getGenericErrorMessage(), { status: 500 });
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