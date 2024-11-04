import { error } from "@sveltejs/kit";
import { getFailFormMessage, unknownErrorTitle } from "$lib/shared/constants/constants";
import { getProfileByUser } from "$lib/server/database/profiles";
import { getListing, getListingsByTeacher as getListingsByTeacher } from "$lib/server/database/listings";
import { fail, message, superValidate } from "sveltekit-superforms";
import { requestContactSchema, startContactSchema } from "$lib/shared/models/conversation";
import { addReviewSchema, type Review } from "$lib/shared/models/review";
import { zod } from "sveltekit-superforms/adapters";
import { getConversationForStudentAndTeacher, startConversation } from "$lib/server/database/conversations";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { ResourceAlreadyExistsError } from "src/lib/shared/errors/resource-already-exists-error.js";
import { createReview, getReviewsByReceiver } from "src/lib/server/database/review.js";
import type { Listing } from "src/lib/shared/models/listing.js";
import type { Message, PsqlError } from "src/lib/shared/models/common.js";
import { loadContactTeacherForms } from "src/lib/shared/utils/utils";

export const load = async (event) => {
    const { locals: { supabase, safeGetSession }, params: { slug }, parent, url: { searchParams } } = event;

    let teacher;
    try {
        teacher = await getProfileByUser(supabase, slug);
    } catch (e) {
        console.error("Error when reading profile with id: " + slug, e);
        error(500, unknownErrorTitle);

    };

    if (teacher.role !== "teacher") {
        console.error("Attempted to read a non-teacher profile: " + slug);
        error(500, unknownErrorTitle);
    }

    const { profile } = await parent();
    const role = profile?.role ?? ""
    const { session } = await safeGetSession();
    const userId = session?.user.id;

    const listingId = searchParams.get('id') || '';
    let listing: Listing | undefined = undefined;
    let listingMessage: Message | undefined = undefined;
    if (listingId) {
        try {
            listing = await getListing(supabase, listingId);
            if (!listing.visible && userId !== listing.profile.id) {
                listingMessage = getFailFormMessage("Kunde inte hämta annonsen", "Denna annonsen är inte tillgänglig just nu.")
                listing = undefined;
            }
        } catch (error) {
            if (error && typeof error === "object") {
                const psqlError = error as PsqlError;
                if (psqlError.code && psqlError.code === "22P02") // invalid input syntax for type uuid - syntax for listing id query param is faulty 
                    listingMessage = getFailFormMessage("Kunde inte hämta annonsen", "Annonsen hittades inte. Kontakta oss om detta fortsätter.");
            }
            else {
                console.error("Error when reading listings for profile with id: " + slug, error);
                listingMessage = getFailFormMessage("Kunde inte hämta annonsen", "Något gick fel. Kontakta oss om detta fortsätter.");
            }
        }
    }

    let reviews: Review[] = [];
    let reviewsMessage: Message | undefined = undefined;
    try {
        reviews = await getReviewsByReceiver(supabase, slug);
    } catch (e) {
        console.error("Error when reading reviews for profile with id: " + slug, e);
        const { user: { id } } = await safeGetSession();
        const isOwner = id === slug;
        if (isOwner) // only show error info to owner
            reviewsMessage = getFailFormMessage("Kunde inte hämta recensioner", "Något gick fel. Kontakta oss om detta fortsätter.");
    }

    let allowCreateReview: boolean = false;
    if (role === "student") {
        const hasExistingReview = reviews.find((r) => r.sender?.id === profile?.id);
        if (!hasExistingReview) {
            if (userId) {
                try {
                    const hasExistingConversation = await getConversationForStudentAndTeacher(supabase, userId, slug);
                    allowCreateReview = hasExistingConversation?.has_replied ? true : false;
                } catch (error) {
                    console.error(`Error when adding review for profile slug ${slug}, unable to read conversation for teacher & student` + slug, error);
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

    const { requestContactForm, startContactForm } = await loadContactTeacherForms(teacher);
    const addReviewForm = await superValidate({ rating: 5 }, zod(addReviewSchema))
    return { teacher, reviews, reviewsMessage, listing, listingMessage, requestContactForm, startContactForm, addReviewForm, allowCreateReview };
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
            return message(form, getFailFormMessage(undefined, "Du kan inte kontakta dig själv.", undefined, undefined, "default"), { status: 403 });

        if (role !== "student")
            return message(form, getFailFormMessage("Detta går ej att göra som lärare", "Skapa ett konto som student om du vill kontakta en annan lärare.", undefined, undefined, "default"), { status: 403 });

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
            return message(form, getFailFormMessage(undefined, "Du kan inte kontakta dig själv.", undefined, undefined, "default"), { status: 403 });

        if (role !== "student")
            return message(form, getFailFormMessage("Detta går ej att göra som lärare", "Skapa ett konto som student om du vill kontakta en annan lärare.", undefined, undefined, "default"), { status: 403 });


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