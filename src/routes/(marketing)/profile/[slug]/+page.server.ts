import { error } from "@sveltejs/kit";
import { getFailFormMessage, unknownErrorMessage } from "$lib/shared/constants/constants";
import { getProfileByUser } from "$lib/server/database/profiles";
import { getListingsByTeacher as getListingsByTeacher } from "$lib/server/database/listings";
import { fail, message, superValidate } from "sveltekit-superforms";
import { requestContactSchema, startContactSchema } from "$lib/shared/models/conversation";
import { addReviewSchema } from "$lib/shared/models/review";
import { zod } from "sveltekit-superforms/adapters";
import { getConversationForStudentAndTeacher, startConversation } from "$lib/server/database/conversations";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { ResourceAlreadyExistsError } from "src/lib/shared/errors/resource-already-exists-error.js";
import { createReview, getReviewsByReceiver } from "src/lib/server/database/review.js";

export const load = async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug }, parent } = event;

    let teacher;
    try {
        teacher = await getProfileByUser(supabase, slug);
    } catch (e) {
        console.error("Error when reading profile with id: " + slug, e);
        error(500, {
                    message: unknownErrorMessage,
                });
    };

    if (teacher.role !== "teacher") {
        console.error("Attempted to read a non-teacher profile: " + slug);
        error(500, {
                    message: unknownErrorMessage,
                });
    }

    let listings;
    try {
        listings = await getListingsByTeacher(supabase, slug, undefined, true);
    } catch (e) {
        console.error("Error when reading listings for profile with id: " + slug, e);
        error(500, {
                    message: unknownErrorMessage,
                });
    }

    let reviews;
    try {
        reviews = await getReviewsByReceiver(supabase, slug);
    } catch (e) {
        console.error("Error when reading reviews for profile with id: " + slug, e);
        error(500, {
                    message: unknownErrorMessage,
                });
    }

    const { profile } = await parent();
    const role = profile?.role ?? "";

    let allowCreateReview: boolean = false;
    if (role === "student") {
        const hasExistingReview = reviews.find((r) => r.sender?.id === profile?.id)
        if (!hasExistingReview) {
            const { session } = await safeGetSession();
            if (session) {
                try {
                    const hasExistingConversation = await getConversationForStudentAndTeacher(supabase, session.user.id, slug);
                    allowCreateReview = hasExistingConversation?.has_replied ? true : false;
                } catch (error) {
                    console.error(`Error when adding review for profile slug ${slug}, unable to read conversation for teacher & student` + slug, error);
                    allowCreateReview = true;
                    // allow in off-chance it's permitted for better UX
                    // backend will block bad request anyhow
                }
            }
        }
    }

    const requestContactForm = await superValidate({ teacher: teacher.id, role }, zod(requestContactSchema))
    const startContactForm = await superValidate({ teacher: teacher.id, role }, zod(startContactSchema))
    const addReviewForm = await superValidate({ rating: 5 }, zod(addReviewSchema))
    return { teacher, listings, reviews, requestContactForm, startContactForm, addReviewForm, allowCreateReview };
}

export const actions = {
    requestContact: async (event) => {
        const { locals: { supabase, safeGetSession }, params: { slug } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/sign-in"); // todo: in the future should implement a redirect after login

        const form = await superValidate(event, zod(requestContactSchema));
        if (!form.data.role) {
            console.error("Error when submitting request contact. Data that user does not submit manually is invalid: role") // user hasnt entered data theirselves, therefore send error message
            return message(form, getFailFormMessage(), { status: 500 });
        }

        const { role } = form.data;

        if (slug === session.user.id)
            return message(form, getFailFormMessage(undefined, "Du kan inte kontakta dig själv."), { status: 403 });

        if (role !== "student") {
            console.error("Non-student tried to contact teacher for profile slug: " + slug, error);
            return message(form, getFailFormMessage(), { status: 403 });
        }

        const conversation = await getConversationForStudentAndTeacher(supabase, session.user.id, slug);
        if (conversation)
            redirect(303, `/account/conversation/${conversation.id}`, { message: 'Du har redan kontaktat läraren.', type: 'info' }, event);

        return { form };
    },
    startContact: async (event) => {
        const { locals: { supabase, safeGetSession }, params: { slug } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/sign-in"); // todo: in the future should implement a redirect after login

        const form = await superValidate(event, zod(startContactSchema));
        // this will not work nicely if teacher or role is invalid, but not expecting this to be an issue
        if (!form.valid) return fail(400, { form });

        const { role, firstMessage } = form.data;

        if (slug === session.user.id)
            return message(form, getFailFormMessage(undefined, "Du kan inte kontakta dig själv."), { status: 403 });

        if (role !== "student") {
            console.error("Non-student tried to contact teacher for profile slug: " + slug, error);
            return message(form, getFailFormMessage(), { status: 403 });
        }

        let conversationId: string;
        try {
            const { id } = await startConversation(supabase, slug, session.user.id, firstMessage, session);
            conversationId = id;
        } catch (error) {
            if (error instanceof ResourceAlreadyExistsError) {
                throw redirect(303, `/account/conversation/${error.message}`, { message: 'Du har redan kontaktat läraren.', type: 'info' }, event);
                // message is conversation id
            }
            console.error("Error when starting conversation for profile slug: " + slug, error);
            return message(form, getFailFormMessage(), { status: 500 });
        }
        throw redirect(303, `/account/conversation/${conversationId}`);
    },
    addReview: async (event) => {
        const { locals: { supabase, safeGetSession }, params: { slug } } = event;
        const { session } = await safeGetSession();
        if (!session)
            throw redirect(303, "/sign-in"); // todo: in the future should implement a redirect after login

        const form = await superValidate(event, zod(addReviewSchema));
        if (!form.valid) return fail(400, { form });
        const { rating, description } = form.data;

        try {
            const conversation = await getConversationForStudentAndTeacher(supabase, session.user.id, slug);
            if (!conversation) {
                console.error(`Error when adding review for profile slug ${slug}, teacher & student has no conversation.`);
                return message(form, getFailFormMessage('Något verkar ha gått snett', 'Har ni haft en lektion ihop? Isåfall kan ni kontakta oss för att få hjälp med att göra recensionen.'), { status: 403 });
            }
        } catch (error) {
            console.error(`Error when adding review for profile slug ${slug}, unable to read conversation for teacher & student` + slug, error);
            return message(form, getFailFormMessage(), { status: 500 });
        }

        try {
            await createReview(supabase, { rating, description: description ?? "" }, slug, session);
        } catch (error) {
            console.error("Error when adding review for profile slug: " + slug, error);
            return message(form, getFailFormMessage(), { status: 500 });
        }

        setFlash({ message: "Din recension har skapats.", type: "success" }, event);
        return { form }
    }
}