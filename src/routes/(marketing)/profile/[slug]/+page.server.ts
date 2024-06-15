import { error } from "@sveltejs/kit";
import { getGenericFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { getProfileByUserId } from "src/lib/server/database/profiles";
import { getListingsByTeacherId } from "src/lib/server/database/listings";
import { fail, message, superValidate } from "sveltekit-superforms";
import { requestContactSchema, startContactSchema } from "src/lib/shared/models/conversations";
import { zod } from "sveltekit-superforms/adapters";
import { getConversationForStudentAndTeacher, startConversation } from "src/lib/server/database/conversations";
import { redirect } from "sveltekit-flash-message/server";
import { ResourceAlreadyExistsError } from "src/lib/shared/errors/resource-already-exists.js";

export const load = async ({ locals: { supabase }, params: { slug }, parent }) => {


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

    const parentData = await parent();
    const role = parentData.profile?.role ?? "";

    const requestContactForm = await superValidate({ teacher: profile.id, role }, zod(requestContactSchema))
    const startContactForm = await superValidate({ teacher: profile.id, role }, zod(startContactSchema))

    return { profile, listings, requestContactForm, startContactForm };
}

export const actions = {
    requestContact: async (event) => {
        const { locals: { supabase, safeGetSession }, params: { slug } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/login"); // todo: in the future should implement a redirect after login

        const form = await superValidate(event, zod(requestContactSchema));
        if (!form.valid) {
            console.error("Error when submitting request contact. Data that user does not submit manually is invalid") // user hasnt entered data theirselves, therefore send error message
            return message(form, getGenericFormMessage(), { status: 500 });
        }

        const { teacher, role } = form.data;

        if (teacher === session.user.id)
            return message(form, getGenericFormMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

        if (role !== "student") {
            console.error("Non-student tried to contact teacher for profile slug: " + slug, error);
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
            throw redirect(303, "/login"); // todo: in the future should implement a redirect after login

        const form = await superValidate(event, zod(startContactSchema));
        if (!form.valid) { // this will not work nicely if teacher or role is invalid, but not expecting this to be an issue
            console.log("invalid")
            return fail(400, {
                form,
            });
        }

        const { teacher, role, firstMessage } = form.data;

        if (teacher === session.user.id)
            return message(form, getGenericFormMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

        if (role !== "student") {
            console.error("Non-student tried to contact teacher for profile slug: " + slug, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }

        if (teacher === session.user.id)
            return message(form, getGenericFormMessage(undefined, undefined, "Du kan inte kontakta dig själv."), { status: 400 });

        let conversationId: string;
        try {
            const { id } = await startConversation(supabase, teacher, session.user.id, firstMessage);
            conversationId = id;
        } catch (error) {
            if (error instanceof ResourceAlreadyExistsError) {
                throw redirect(303, `/account/conversation/${error.message}`, { message: 'Du har redan kontaktat läraren.', type: 'info' }, event); // message is conversation id
            }
            console.error("Error when starting conversation for profile slug: " + slug, error);
            return message(form, getGenericFormMessage(), { status: 500 });
        }
        throw redirect(303, `/account/conversation/${conversationId}`);
    }
}